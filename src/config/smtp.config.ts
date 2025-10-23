import { resolve } from 'path';
import { toNumber } from 'lodash';
import { toBoolean } from '@/modules/core/helpers';
import { createSmtpConfig } from '@/modules/sender/helpers';

export const smtp = createSmtpConfig((configure) => ({
    host: configure.env('SMTP_HOST', 'your-smtp-host'),
    user: configure.env('SMTP_USER', 'your-smtp-username'),
    password: configure.env('SMTP_PASSWORD', 'your-smtp-password'),
    port: configure.env<number>('SMTP_PORT', (v) => toNumber(v), 25),
    secure: configure.env<boolean>('SMTP_SECURE', (v) => toBoolean(v), false),
    resource: resolve(__dirname, '../../assets/emails'),
}));