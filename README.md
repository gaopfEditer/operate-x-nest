# NestPlus - 基于NestJS的全栈内容管理系统

[![NestJS](https://img.shields.io/badge/NestJS-9.0.11-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.5.2-green.svg)](https://www.fastify.io/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.10-orange.svg)](https://typeorm.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 项目简介

NestPlus 是一个基于 NestJS 框架构建的现代化全栈内容管理系统，集成了用户管理、内容管理、漫画管理、小说管理、权限控制、媒体管理等功能模块。项目采用模块化架构设计，支持多数据库连接、全文搜索、消息队列、WebSocket等高级特性。

## ✨ 核心特性

### 🎯 功能模块
- **用户系统** - 完整的用户注册、登录、权限管理
- **内容管理** - 文章、分类、评论系统
- **漫画管理** - 漫画作品、章节、推荐系统
- **小说管理** - 小说作品、章节管理
- **媒体管理** - 文件上传、图片处理
- **权限控制** - 基于RBAC的细粒度权限管理
- **消息系统** - 站内消息、通知推送
- **搜索功能** - 基于Elasticsearch的全文搜索

### 🛠 技术特性
- **模块化架构** - 基于NestJS的模块化设计
- **多数据库支持** - MySQL主数据库 + Redis缓存
- **全文搜索** - Elasticsearch集成
- **消息队列** - BullMQ任务队列
- **WebSocket** - 实时通信支持
- **API文档** - Swagger自动生成
- **数据验证** - Class-validator数据校验
- **类型安全** - 完整的TypeScript支持

## 🏗 项目结构

```
src/
├── assets/                    # 静态资源
│   ├── emails/               # 邮件模板
│   ├── media/                # 媒体文件
│   └── posts/                # 文章内容
├── config/                   # 配置文件
│   ├── app.config.ts         # 应用配置
│   ├── database.config.ts    # 数据库配置
│   ├── redis.config.ts       # Redis配置
│   ├── elastic.config.ts     # Elasticsearch配置
│   ├── smtp.config.ts        # 邮件配置
│   └── ...
├── modules/                  # 功能模块
│   ├── core/                 # 核心模块
│   │   ├── decorators/       # 装饰器
│   │   ├── exceptions/       # 异常处理
│   │   ├── guards/           # 守卫
│   │   ├── pipes/            # 管道
│   │   └── providers/        # 提供者
│   ├── user/                 # 用户模块
│   │   ├── controllers/      # 控制器
│   │   ├── entities/         # 实体
│   │   ├── services/         # 服务
│   │   ├── dtos/             # 数据传输对象
│   │   ├── guards/           # 认证守卫
│   │   └── strategies/       # 认证策略
│   ├── content/              # 内容模块
│   │   ├── controllers/      # 文章、分类、评论控制器
│   │   ├── entities/         # 内容实体
│   │   ├── services/         # 内容服务
│   │   └── subscribers/      # 事件订阅者
│   ├── manga/                # 漫画模块
│   │   ├── controllers/      # 漫画控制器
│   │   ├── entities/         # 漫画实体
│   │   └── services/         # 漫画服务
│   ├── novel/                # 小说模块
│   │   ├── controllers/      # 小说控制器
│   │   ├── entities/         # 小说实体
│   │   └── services/         # 小说服务
│   ├── media/                # 媒体模块
│   │   ├── controllers/      # 媒体控制器
│   │   ├── entities/         # 媒体实体
│   │   └── services/         # 媒体服务
│   ├── rbac/                 # 权限控制模块
│   │   ├── entities/         # 角色权限实体
│   │   ├── guards/           # 权限守卫
│   │   └── services/         # 权限服务
│   ├── database/             # 数据库模块
│   │   ├── base/             # 基础实体
│   │   ├── commands/         # 数据库命令
│   │   ├── migrations/       # 数据库迁移
│   │   └── seeders/          # 数据填充
│   ├── elastic/              # 搜索模块
│   ├── redis/                # 缓存模块
│   ├── queue/                # 队列模块
│   ├── sender/               # 消息发送模块
│   └── restful/              # RESTful API模块
├── routes/                   # 路由配置
├── database/                 # 数据库相关
│   ├── factories/            # 数据工厂
│   ├── migrations/           # 数据库迁移
│   └── seeders/              # 数据填充
└── main.ts                   # 应用入口
```

## 🚀 技术栈

### 后端框架
- **NestJS** - 渐进式Node.js框架
- **Fastify** - 高性能HTTP服务器
- **TypeScript** - 类型安全的JavaScript超集

### 数据库
- **MySQL** - 主数据库
- **TypeORM** - ORM框架
- **Redis** - 缓存和会话存储

### 搜索与队列
- **Elasticsearch** - 全文搜索引擎
- **BullMQ** - 基于Redis的任务队列

### 认证与安全
- **JWT** - JSON Web Token认证
- **Passport** - 认证中间件
- **bcryptjs** - 密码加密
- **CASL** - 权限控制库

### 通信与通知
- **WebSocket** - 实时通信
- **Nodemailer** - 邮件发送
- **腾讯云SMS** - 短信服务
- **阿里云邮件** - 邮件服务

### 开发工具
- **Swagger** - API文档生成
- **Jest** - 单元测试
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

## 📦 安装与运行

### 环境要求
- Node.js >= 16.0.0
- MySQL >= 5.7
- Redis >= 6.0
- Elasticsearch >= 8.0 (可选)

### 安装依赖
```bash
# 使用pnpm安装依赖
pnpm install

# 或使用npm
npm install
```

### 环境配置
1. 复制环境变量配置文件：
```bash
cp env.example .env
```

2. 修改 `.env` 文件中的配置：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nestplus

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# 应用配置
APP_HOST=127.0.0.1
APP_PORT=3100
APP_URL=http://localhost:3100

# JWT配置
USER_TOKEN_SECRET=your_jwt_secret
USER_REFRESH_TOKEN_SECRET=your_refresh_secret

# 邮件配置
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password

# 短信配置
SMS_QCLOUD_APPID=your_app_id
SMS_QCLOUD_ID=your_secret_id
SMS_QCLOUD_KEY=your_secret_key
```

### 数据库初始化
```bash
# 运行数据库迁移
pnpm cli database:migration:run

# 运行数据填充
pnpm cli database:seed:run
```

### 启动应用
```bash
# 开发模式
pnpm start:dev

# 生产模式
pnpm build
pnpm start:prod
```

## 📚 API文档

启动应用后，访问以下地址查看API文档：
- Swagger UI: `http://localhost:3100/api-docs`
- JSON格式: `http://localhost:3100/api-docs-json`

## 🔧 可用脚本

```bash
# 开发
pnpm start:dev          # 开发模式启动
pnpm start:debug        # 调试模式启动

# 构建
pnpm build              # 构建项目
pnpm start:prod         # 生产模式启动

# 测试
pnpm test               # 运行单元测试
pnpm test:watch         # 监听模式测试
pnpm test:e2e           # 端到端测试
pnpm test:cov           # 测试覆盖率

# 代码质量
pnpm lint               # 代码检查
pnpm format             # 代码格式化

# 数据库
pnpm cli database:migration:run     # 运行迁移
pnpm cli database:seed:run          # 运行填充
pnpm cli user:token:gen             # 生成JWT密钥
```

## 🏛 架构设计

### 模块化架构
项目采用NestJS的模块化架构，每个功能模块都是独立的，包含：
- **Controllers** - 处理HTTP请求
- **Services** - 业务逻辑处理
- **Entities** - 数据模型
- **DTOs** - 数据传输对象
- **Guards** - 认证和授权
- **Pipes** - 数据验证和转换

### 数据库设计
- **多数据库支持** - 支持MySQL主数据库和Redis缓存
- **实体关系** - 使用TypeORM管理复杂的实体关系
- **数据迁移** - 版本化的数据库结构管理
- **数据填充** - 开发环境数据初始化

### 权限控制
- **RBAC模型** - 基于角色的访问控制
- **细粒度权限** - 支持资源级别的权限控制
- **动态权限** - 支持运行时权限配置

## 🔐 安全特性

- **JWT认证** - 无状态的用户认证
- **密码加密** - 使用bcryptjs加密存储
- **输入验证** - 全面的数据验证和清理
- **SQL注入防护** - 使用ORM防止SQL注入
- **XSS防护** - HTML内容清理
- **CORS支持** - 跨域资源共享配置

## 📈 性能优化

- **Redis缓存** - 高频数据缓存
- **数据库索引** - 优化查询性能
- **分页查询** - 大数据量分页处理
- **异步处理** - 消息队列处理耗时任务
- **CDN支持** - 静态资源CDN加速

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

## 👨‍💻 作者

**pincman**
- 邮箱: pincman@qq.com
- 网站: https://pincman.com
- GitHub: [@pincman](https://github.com/pincman)

## 🙏 致谢

感谢以下开源项目的支持：
- [NestJS](https://nestjs.com/) - 渐进式Node.js框架
- [TypeORM](https://typeorm.io/) - TypeScript ORM
- [Fastify](https://www.fastify.io/) - 高性能HTTP服务器
- [Elasticsearch](https://www.elastic.co/) - 搜索引擎
- [Redis](https://redis.io/) - 内存数据库

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
