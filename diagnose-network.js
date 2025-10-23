const net = require('net');
const dns = require('dns').promises;

async function diagnoseNetwork() {
    console.log('=== 网络连接诊断 ===\n');

    const smtpServers = [
        { name: 'Gmail', host: 'smtp.gmail.com', port: 587 },
        { name: 'QQ邮箱', host: 'smtp.qq.com', port: 587 },
        { name: '163邮箱', host: 'smtp.163.com', port: 587 },
        { name: '126邮箱', host: 'smtp.126.com', port: 587 }
    ];

    for (const server of smtpServers) {
        console.log(`--- 测试 ${server.name} (${server.host}:${server.port}) ---`);

        try {
            // 1. DNS解析测试
            console.log('1. DNS解析测试...');
            const addresses = await dns.resolve4(server.host);
            console.log(`   ✅ DNS解析成功: ${addresses.join(', ')}`);

            // 2. TCP连接测试
            console.log('2. TCP连接测试...');
            const socket = new net.Socket();

            const connectPromise = new Promise((resolve, reject) => {
                socket.setTimeout(5000);

                socket.on('connect', () => {
                    console.log('   ✅ TCP连接成功');
                    socket.destroy();
                    resolve('connected');
                });

                socket.on('timeout', () => {
                    console.log('   ❌ TCP连接超时');
                    socket.destroy();
                    reject(new Error('Connection timeout'));
                });

                socket.on('error', (err) => {
                    console.log(`   ❌ TCP连接失败: ${err.message}`);
                    socket.destroy();
                    reject(err);
                });
            });

            socket.connect(server.port, server.host);
            await connectPromise;

        } catch (error) {
            console.log(`   ❌ 测试失败: ${error.message}`);
        }

        console.log('');
    }

    // 3. 网络环境检测
    console.log('--- 网络环境检测 ---');
    try {
        const https = require('https');
        const httpPromise = new Promise((resolve, reject) => {
            const req = https.get('https://www.baidu.com', (res) => {
                console.log('✅ HTTPS连接正常 (百度)');
                resolve();
            });
            req.on('error', (err) => {
                console.log(`❌ HTTPS连接失败: ${err.message}`);
                reject(err);
            });
            req.setTimeout(5000, () => {
                console.log('❌ HTTPS连接超时');
                reject(new Error('HTTPS timeout'));
            });
        });
        await httpPromise;
    } catch (error) {
        console.log(`❌ 网络环境检测失败: ${error.message}`);
    }

    console.log('\n=== 诊断结论 ===');
    console.log('如果TCP连接都失败，说明网络环境阻止了SMTP端口');
    console.log('如果HTTPS正常但SMTP失败，说明是端口限制问题');
    console.log('建议使用阿里云邮件推送等API服务替代SMTP');
}

diagnoseNetwork().catch(console.error);
