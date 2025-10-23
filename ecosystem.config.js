module.exports = {
    apps: [
        {
            name: 'nest-app',
            script: 'dist/main.js',
            instances: 1, // 先用单实例测试
            exec_mode: 'fork', // 先用fork模式测试
            env: {
                NODE_ENV: 'production',
                PORT: 3101,
                REDIS_HOST: '1.94.137.69',
                REDIS_PORT: '6379',
                REDIS_PASSWORD: 'foobared',
                DB_HOST: '1.94.137.69',
                DB_PORT: '3306',
                DB_USER: 'root',
                DB_PASSWORD: '123456',
                DB_NAME: '3r',
            },
        },
    ],
};
