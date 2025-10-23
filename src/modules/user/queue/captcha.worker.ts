import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, Worker } from 'bullmq';
import chalk from 'chalk';
import { omit } from 'lodash';
import { Repository } from 'typeorm';

import { Configure } from '@/modules/core/configure';

import { RedisConfig } from '@/modules/redis/types';
import { SmsService, SmtpService, AliyunEmailService } from '@/modules/sender/services';

import { EMAIL_CAPTCHA_JOB, PHONE_CAPTCHA_JOB, SEND_CAPTCHA_QUEUE } from '../constants';
import { CaptchaEntity } from '../entities/captcha.entity';
import { EmailCaptchaOption, PhoneCaptchaOption, SendCaptchaQueueJob } from '../types';

/**
 * 发信任务消费者
 */
@Injectable()
export class CaptchaWorker {
    constructor(
        @InjectRepository(CaptchaEntity)
        private captchaRepository: Repository<CaptchaEntity>,
        private readonly sms: SmsService,
        private readonly mailer: SmtpService,
        private readonly aliyunEmail: AliyunEmailService,
        protected configure: Configure,
    ) {}

    async addWorker() {
        console.log('=== 启动邮件队列处理器 ===');
        const redisConf = (await this.configure.get<RedisConfig>('redis')) ?? [];
        const connection = redisConf.find(({ name }) => name === 'default');
        console.log('Redis配置:', connection);
        console.log('队列名称:', SEND_CAPTCHA_QUEUE);

        const worker = new Worker(
            SEND_CAPTCHA_QUEUE,
            async (job: Job<SendCaptchaQueueJob>) => this.sendCode(job),
            { concurrency: 10, connection },
        );

        // 添加事件监听
        worker.on('ready', () => {
            console.log('队列处理器已准备就绪');
        });

        worker.on('error', (err) => {
            console.error('队列处理器错误:', err);
        });

        worker.on('failed', (job, err) => {
            console.error('任务失败:', job?.id, err);
        });

        console.log('邮件队列处理器已启动');
        return worker;
    }

    /**
     * 发送验证码
     * @param job
     */
    protected async sendCode(job: Job<SendCaptchaQueueJob>) {
        console.log('=== 队列处理器收到任务 ===');
        console.log('任务名称:', job.name);
        console.log('任务数据:', job.data);

        const { captcha } = job.data;
        try {
            if (job.name === PHONE_CAPTCHA_JOB || job.name === EMAIL_CAPTCHA_JOB) {
                if (job.name === PHONE_CAPTCHA_JOB) {
                    console.log('发送短信验证码');
                    await this.sendPhone(job.data);
                } else if (job.name === EMAIL_CAPTCHA_JOB) {
                    console.log('发送邮件验证码');
                    await this.sendEmail(job.data);
                }
                return await this.captchaRepository.save(
                    omit(captcha, ['created_at', 'updated_at']),
                );
            }
            return false;
        } catch (err) {
            console.log(chalk.red('队列处理错误:'), err);
            throw new Error(err as string);
        }
    }

    /**
     * 发送短信验证码
     * @param data
     */
    protected async sendPhone(data: SendCaptchaQueueJob) {
        const {
            captcha: { value, code },
            option,
            otherVars,
        } = data;
        const { template } = option as PhoneCaptchaOption;
        const result = await this.sms.send({
            numbers: [value],
            template,
            vars: otherVars ? { code, ...otherVars } : { code },
        });
        return result;
    }

    /**
     * 发送邮件验证码
     * @param data
     */
    protected async sendEmail(data: SendCaptchaQueueJob) {
        const {
            captcha: { action, value, code },
            option,
        } = data;
        const { template, subject } = option as EmailCaptchaOption;

        console.log('=== 邮件发送调试信息 ===');
        console.log('收件人邮箱:', value);
        console.log('验证码:', code);
        console.log('邮件主题:', subject);
        console.log('模板名称:', template);
        console.log('操作类型:', action);

        try {
            // 优先使用阿里云邮件推送服务
            console.log('尝试使用阿里云邮件推送服务...');
            const result = await this.aliyunEmail.sendCaptcha(value, code, action);
            console.log('阿里云邮件发送成功:', result);
            return result;
        } catch (aliyunError) {
            console.warn('阿里云邮件发送失败，尝试使用SMTP:', (aliyunError as Error).message);

            try {
                // 备用方案：使用SMTP
                const result = await this.mailer.send({
                    name: action,
                    subject,
                    template,
                    html: !template,
                    to: [value],
                    vars: { code },
                });
                console.log('SMTP邮件发送成功:', result);
                return result;
            } catch (smtpError) {
                console.error('SMTP邮件发送也失败:', smtpError);
                throw new Error(`邮件发送失败: 阿里云(${(aliyunError as Error).message}), SMTP(${(smtpError as Error).message})`);
            }
        }
    }
}
