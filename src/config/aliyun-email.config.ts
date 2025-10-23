import { resolve } from 'path';
import { toBoolean } from '@/modules/core/helpers';
import { createAliyunEmailConfig } from '@/modules/sender/helpers';

export const aliyunEmail = createAliyunEmailConfig((configure) => ({
    accessKeyId: configure.env('ALIYUN_EMAIL_ACCESS_KEY_ID', 'your-access-key-id'),
    accessKeySecret: configure.env('ALIYUN_EMAIL_ACCESS_KEY_SECRET', 'your-access-key-secret'),
    fromAddress: configure.env('ALIYUN_EMAIL_FROM_ADDRESS', '2060197792@qq.com'),
    fromAlias: configure.env('ALIYUN_EMAIL_FROM_ALIAS', '系统通知'),
}));
