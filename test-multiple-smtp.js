const nodemailer = require('nodemailer');

async function testMultipleSMTP() {
    console.log('=== 测试多个SMTP服务商 ===');
    
    const providers = [
        {
            name: 'QQ邮箱',
            host: 'smtp.qq.com',
            port: 587,
            secure: false,
            requireTLS: true
        },
        {
            name: '163邮箱',
            host: 'smtp.163.com',
            port: 587,
            secure: false,
            requireTLS: true
        },
        {
            name: '126邮箱',
            host: 'smtp.126.com',
            port: 587,
            secure: false,
            requireTLS: true
        },
        {
            name: 'Gmail (备用)',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true
        }
    ];
    
    for (const provider of providers) {
        console.log(`\n--- 测试 ${provider.name} ---`);
        try {
            const transporter = nodemailer.createTransport({
                host: provider.host,
                port: provider.port,
                secure: provider.secure,
                requireTLS: provider.requireTLS,
                auth: {
                    user: 'f17681831400@gmail.com',
                    pass: 'gcuoubsmghtjnpxa'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            
            console.log(`连接 ${provider.host}:${provider.port}...`);
            await transporter.verify();
            console.log(`✅ ${provider.name} 连接成功！`);
            
            transporter.close();
            return provider; // 返回第一个成功的配置
            
        } catch (error) {
            console.error(`❌ ${provider.name} 连接失败:`, error.message);
        }
    }
    
    console.log('\n❌ 所有SMTP服务商都无法连接');
    return null;
}

testMultipleSMTP().then(result => {
    if (result) {
        console.log('\n🎉 推荐使用:', result.name);
        console.log('配置:', {
            host: result.host,
            port: result.port,
            secure: result.secure,
            requireTLS: result.requireTLS
        });
    }
}).catch(console.error);
