const nodemailer = require('nodemailer');

async function testGmailConnection() {
    console.log('=== 测试Gmail SMTP连接 ===');

    // 测试配置
    const configs = [
        {
            name: '配置1: 587端口 + STARTTLS',
            options: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: 'f17681831400@gmail.com',
                    pass: 'gcuoubsmghtjnpxa',
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
        },
        {
            name: '配置2: 465端口 + SSL',
            options: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'f17681831400@gmail.com',
                    pass: 'gcuoubsmghtjnpxa',
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
        },
    ];

    for (const config of configs) {
        console.log(`\n--- ${config.name} ---`);
        try {
            const transporter = nodemailer.createTransport(config.options);

            // 验证连接
            console.log('验证连接中...');
            await transporter.verify();
            console.log('✅ 连接验证成功！');

            // 发送测试邮件
            console.log('发送测试邮件...');
            const info = await transporter.sendMail({
                from: 'f17681831400@gmail.com',
                to: 'f1241961245@gmail.com',
                subject: 'SMTP测试邮件',
                text: '这是一封测试邮件，用于验证SMTP连接是否正常。',
                html: '<p>这是一封测试邮件，用于验证SMTP连接是否正常。</p>',
            });

            console.log('✅ 邮件发送成功！');
            console.log('消息ID:', info.messageId);

            transporter.close();
            break; // 如果成功就退出循环
        } catch (error) {
            console.error('❌ 连接失败:', error.message);
            console.error('错误代码:', error.code);
            console.error('错误类型:', error.errno);
        }
    }
}

testGmailConnection().catch(console.error);
