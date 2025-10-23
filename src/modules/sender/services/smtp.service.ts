import path from 'path';

import { Injectable } from '@nestjs/common';
import Email from 'email-templates';
import { pick } from 'lodash';
import mailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

import { deepMerge } from '@/modules/core/helpers';

import { SmtpConfig, SmtpSendParams } from '../types';

/**
 * SMTP邮件发送驱动
 */
@Injectable()
export class SmtpService {
    /**
     * 初始化配置
     * @param options
     */
    constructor(protected readonly options: SmtpConfig) {}

    /**
     * 合并配置并发送邮件
     * @param params
     * @param options
     */
    async send<T>(params: SmtpSendParams & T, options?: SmtpConfig) {
        const newOptions = deepMerge(this.options, options ?? {}) as SmtpConfig;

        // 重试机制
        const maxRetries = 3;
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`=== 尝试发送邮件 (第${attempt}次) ===`);
                const client = this.makeClient(newOptions);

                // 连接验证
                await client.verify();
                console.log('SMTP连接验证成功');

                // 发送邮件
                const result = await this.makeSend(client, params, newOptions);
                console.log('邮件发送成功');

                // 关闭连接
                client.close();
                return result;
            } catch (error) {
                lastError = error as Error;
                console.error(`第${attempt}次尝试失败:`, error);

                if (attempt < maxRetries) {
                    const delay = attempt * 2000; // 递增延迟
                    console.log(`${delay}ms后重试...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`邮件发送失败，已重试${maxRetries}次。最后错误: ${lastError?.message}`);
    }

    /**
     * 创建NodeMailer客户端
     * @param options
     */
    protected makeClient(options: SmtpConfig) {
        const { host, user, password, port } = options;

        // 针对Gmail优化的配置
        const clientOptions: SMTPConnection.Options = {
            host,
            port: port || 587,
            secure: false, // 强制使用STARTTLS而不是SSL
            requireTLS: true, // 要求TLS加密
            connectionTimeout: 30000,
            greetingTimeout: 30000,
            socketTimeout: 30000,
            auth: {
                user,
                pass: password,
            },
            // 移除可能引起问题的TLS配置
            tls: {
                rejectUnauthorized: false,
            },
            // 添加调试信息
            debug: true,
            logger: true,
        };

        console.log('=== SMTP连接配置 ===');
        console.log('主机:', host);
        console.log('端口:', clientOptions.port);
        console.log('安全模式:', clientOptions.secure);
        console.log('TLS要求:', clientOptions.requireTLS);
        console.log('连接超时:', clientOptions.connectionTimeout);
        console.log('用户名:', user);
        console.log('密码长度:', password ? password.length : 0);

        return mailer.createTransport(clientOptions);
    }

    /**
     * 转义通用发送参数为NodeMailer发送参数
     * @param client
     * @param params
     * @param options
     */
    protected async makeSend(client: Mail, params: SmtpSendParams, options: SmtpConfig) {
        const tplPath = path.resolve(options.resource, params.name ?? 'custom');
        const textOnly = !params.html && params.text;
        const noHtmlToText = params.html && params.text;
        const configd: Email.EmailConfig = {
            preview: params.preview ?? false,
            send: !params.preview,
            message: { from: params.from ?? options.from ?? options.user },
            transport: client,
            subjectPrefix: params.subjectPrefix,
            textOnly,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: tplPath,
                },
            },
        };
        if (noHtmlToText) configd.htmlToText = false;
        const email = new Email(configd);
        const message = {
            ...pick(params, ['from', 'to', 'reply', 'attachments', 'subject']),
            template: tplPath,
        };
        return email.send({
            template: tplPath,
            message,
            locals: params.vars,
        });
    }
}
