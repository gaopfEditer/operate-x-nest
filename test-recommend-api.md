# 漫画推荐API测试文档

## 推荐列表接口

### 1. 基础推荐列表
```
GET /api/v1/mangas/recommended?limit=12
```
- 获取12个推荐漫画（默认随机排序）
- 只返回 `recommended=true` 的漫画

### 2. 按类别推荐
```
GET /api/v1/mangas/recommended?limit=12&category=动作
```
- 获取指定类别的推荐漫画
- 支持JSON数组中的类别匹配

### 3. 按标签推荐
```
GET /api/v1/mangas/recommended?limit=12&tags=热血,冒险
```
- 获取包含指定标签的推荐漫画
- 支持多个标签，用逗号分隔

### 4. 按类别和标签组合推荐
```
GET /api/v1/mangas/recommended?limit=12&category=动作&tags=热血,冒险
```
- 同时满足类别和标签条件的推荐漫画

### 5. 非随机排序
```
GET /api/v1/mangas/recommended?limit=12&random=false
```
- 按创建时间降序排列（最新优先）

## 随机推荐接口

### 1. 基础随机推荐
```
GET /api/v1/mangas/random?limit=12
```
- 获取12个随机漫画
- 包含所有启用的漫画

### 2. 按类别随机推荐
```
GET /api/v1/mangas/random?limit=12&category=动作
```
- 获取指定类别的随机漫画

### 3. 按标签随机推荐
```
GET /api/v1/mangas/random?limit=12&tags=热血,冒险
```
- 获取包含指定标签的随机漫画

### 4. 排除推荐漫画
```
GET /api/v1/mangas/random?limit=12&excludeRecommended=true
```
- 获取非推荐漫画的随机列表

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| limit | number | 12 | 返回数量限制 |
| category | string | - | 类别筛选 |
| tags | string | - | 标签筛选，多个用逗号分隔 |
| random | boolean | true | 是否随机排序（仅推荐接口） |
| excludeRecommended | boolean | false | 是否排除推荐漫画（仅随机接口） |

## 使用示例

### 获取热门动作漫画
```bash
curl "http://127.0.0.1:3101/api/v1/mangas/recommended?limit=8&category=动作&random=true"
```

### 获取随机冒险标签漫画
```bash
curl "http://127.0.0.1:3101/api/v1/mangas/random?limit=6&tags=冒险,热血"
```

### 获取非推荐的最新漫画
```bash
curl "http://127.0.0.1:3101/api/v1/mangas/random?limit=10&excludeRecommended=true"
```

### 调试接口 - 查看数据统计
```bash
curl "http://127.0.0.1:3101/api/v1/mangas/debug"
```

## 问题解决方案

### 1. 数据不足问题
- **原因**：数据库中符合条件的漫画数量少于请求的limit
- **解决方案**：新的实现会自动补充其他漫画，确保返回足够数量

### 2. 随机性问题
- **原因**：MySQL的RAND()函数在某些情况下不够随机
- **解决方案**：使用多层排序（RAND() + view_count + createdAt）提高随机性

### 3. 调试方法
使用调试接口查看数据库中的实际数据情况：
```bash
curl "http://127.0.0.1:3101/api/v1/mangas/debug"
```

这会返回：
- 总漫画数量
- 推荐漫画数量
- 非推荐漫画数量
- 统计信息说明
