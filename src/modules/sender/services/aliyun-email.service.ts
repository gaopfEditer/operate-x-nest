import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

import { Configure } from '@/modules/core/configure';

import { AliyunEmailConfig, AliyunEmailSendParams } from '../types';

/**
 * 阿里云邮件推送服务
 */
@Injectable()
export class AliyunEmailService {
    private config: AliyunEmailConfig;

    constructor(protected configure: Configure) {
        this.init();
    }

    /**
     * 初始化阿里云客户端
     */
    private async init() {
        this.config = await this.configure.get<AliyunEmailConfig>('aliyunEmail');
        console.log('阿里云邮件推送服务初始化成功');
    }

    /**
     * 发送邮件
     * @param params 发送参数
     */
    async send(params: AliyunEmailSendParams) {
        try {
            console.log('=== 阿里云邮件推送 ===');
            console.log('收件人:', params.to);
            console.log('主题:', params.subject);
            console.log('发件人:', this.config.fromAddress);

            // 使用HTTP请求发送邮件
            const response = await this.sendHttpRequest(params);

            console.log('邮件发送成功:', response);
            return response;

        } catch (error) {
            console.error('阿里云邮件发送失败:', error);
            throw new Error(`邮件发送失败: ${(error as Error).message}`);
        }
    }

    /**
     * 发送HTTP请求到阿里云API
     */
    private async sendHttpRequest(params: AliyunEmailSendParams) {
        const https = require('https');
        const querystring = require('querystring');

        // 构建请求参数
        const requestParams: Record<string, string> = {
            Action: 'SingleSendMail',
            Version: '2015-11-23',
            AccountName: this.config.fromAddress,
            AddressType: '1',
            ToAddress: params.to,
            Subject: params.subject,
            HtmlBody: params.htmlBody || '',
            TextBody: params.textBody || '',
            FromAlias: this.config.fromAlias || '系统通知',
            Format: 'JSON',
            AccessKeyId: this.config.accessKeyId,
            SignatureMethod: 'HMAC-SHA1',
            SignatureVersion: '1.0',
            SignatureNonce: Math.random().toString(36).substring(2, 15),
            Timestamp: new Date().toISOString(),
        };

        // 生成签名
        const signature = this.generateSignature(requestParams);
        requestParams.Signature = signature;

        // 发送请求
        const postData = querystring.stringify(requestParams);

        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'dm.aliyuncs.com',
                port: 443,
                path: '/',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData),
                },
            };

            const req = https.request(options, (res: any) => {
                let data = '';
                res.on('data', (chunk: any) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (result.Code === 'OK') {
                            resolve(result);
                        } else {
                            reject(new Error(result.Message || '发送失败'));
                        }
                    } catch (e) {
                        reject(new Error('响应解析失败'));
                    }
                });
            });

            req.on('error', (err: any) => {
                reject(err);
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * 生成阿里云API签名
     */
    private generateSignature(params: Record<string, string>): string {
        // 按参数名排序
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        // 构建签名字符串
        const stringToSign = `POST&${encodeURIComponent('/')}&${encodeURIComponent(sortedParams)}`;

        // 生成签名
        const signature = createHmac('sha1', `${this.config.accessKeySecret}&`)
            .update(stringToSign)
            .digest('base64');

        return signature;
    }

    /**
     * 发送验证码邮件
     * @param to 收件人
     * @param code 验证码
     * @param action 操作类型
     */
    async sendCaptcha(to: string, code: string, action: string = 'register') {
        const subject = this.getSubjectByAction(action);
        const htmlBody = this.getHtmlBodyByAction(action, code);
        const textBody = this.getTextBodyByAction(action, code);

        return this.send({
            to,
            subject,
            htmlBody,
            textBody,
        });
    }

    /**
     * 根据操作类型获取邮件主题
     */
    private getSubjectByAction(action: string): string {
        const subjects: Record<string, string> = {
            register: '注册验证码',
            login: '登录验证码',
            resetPassword: '重置密码验证码',
            retrievePassword: '找回密码验证码',
            accountBound: '绑定账号验证码',
        };
        return subjects[action] || '验证码';
    }

    /**
     * 根据操作类型获取HTML邮件内容
     */
    private getHtmlBodyByAction(action: string, code: string): string {
        const actionText = this.getSubjectByAction(action);
        return `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                <h2 style="color: #333; text-align: center;">${actionText}</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <p style="font-size: 16px; color: #666; margin: 10px 0;">您的验证码是：</p>
                    <div style="font-size: 32px; font-weight: bold; color: #1890ff; letter-spacing: 4px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="font-size: 14px; color: #999;">验证码5分钟内有效，请勿泄露给他人</p>
                </div>
                <p style="font-size: 12px; color: #999; text-align: center;">
                    此邮件由系统自动发送，请勿回复
                </p>
            </div>
        `;
    }

    /**
     * 根据操作类型获取纯文本邮件内容
     */
    private getTextBodyByAction(action: string, code: string): string {
        const actionText = this.getSubjectByAction(action);
        return `
${actionText}

您的验证码是：${code}

验证码5分钟内有效，请勿泄露给他人。

此邮件由系统自动发送，请勿回复。
        `.trim();
    }
}
