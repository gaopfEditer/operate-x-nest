# 漫画统计字段设计方案

## 设计决策

经过分析，我们选择了**合表设计**方案，将观看数量、点赞数量、收藏数量字段直接添加到漫画主表中。

## 设计优势

### 1. 性能优势
- **减少JOIN查询**：避免跨表关联，提高查询性能
- **简化缓存策略**：可以统一缓存漫画信息，包括统计字段
- **减少网络开销**：单次查询获取所有需要的数据

### 2. 开发优势
- **代码逻辑简单**：统计操作直接在主表上进行
- **维护成本低**：无需管理多个表之间的数据同步
- **与现有架构一致**：小说模块已采用类似设计

### 3. 业务优势
- **实时性好**：统计字段与漫画信息同步更新
- **便于实现排行榜**：可以基于统计字段进行排序查询
- **支持复杂查询**：可以组合多个统计条件进行筛选

## 实现方案

### 1. 数据库字段
```sql
-- 添加统计字段到漫画表
ALTER TABLE `mangas` 
ADD COLUMN `view_count` bigint NOT NULL DEFAULT '0' COMMENT '观看数量',
ADD COLUMN `like_count` bigint NOT NULL DEFAULT '0' COMMENT '点赞数量',
ADD COLUMN `favorite_count` bigint NOT NULL DEFAULT '0' COMMENT '收藏数量';

-- 添加索引以提高查询性能
ALTER TABLE `mangas` 
ADD INDEX `idx_mangas_view_count` (`view_count`),
ADD INDEX `idx_mangas_like_count` (`like_count`),
ADD INDEX `idx_mangas_favorite_count` (`favorite_count`);

-- 添加复合索引用于排序查询
ALTER TABLE `mangas` 
ADD INDEX `idx_mangas_view_created` (`view_count`, `created_at`),
ADD INDEX `idx_mangas_like_created` (`like_count`, `created_at`),
ADD INDEX `idx_mangas_favorite_created` (`favorite_count`, `created_at`);
```

### 2. 实体字段
```typescript
@Expose()
@Column({ comment: '观看数量', type: 'bigint', default: 0 })
@Index()
view_count!: number;

@Expose()
@Column({ comment: '点赞数量', type: 'bigint', default: 0 })
@Index()
like_count!: number;

@Expose()
@Column({ comment: '收藏数量', type: 'bigint', default: 0 })
@Index()
favorite_count!: number;
```

### 3. API端点

#### 统计操作
- `POST /mangas/:id/view` - 增加观看数量
- `POST /mangas/:id/like` - 增加点赞数量
- `DELETE /mangas/:id/like` - 减少点赞数量
- `POST /mangas/:id/favorite` - 增加收藏数量
- `DELETE /mangas/:id/favorite` - 减少收藏数量

#### 排行榜查询
- `GET /mangas/popular` - 热门漫画（按观看数量排序）
- `GET /mangas/most-liked` - 最受欢迎漫画（按点赞数量排序）
- `GET /mangas/most-favorited` - 收藏最多漫画（按收藏数量排序）

#### 查询筛选
- `min_view_count` / `max_view_count` - 观看数量范围筛选
- `min_like_count` / `max_like_count` - 点赞数量范围筛选
- `min_favorite_count` / `max_favorite_count` - 收藏数量范围筛选

### 4. 服务方法

#### 统计操作
```typescript
async incrementViewCount(mangaId: string): Promise<void>
async incrementLikeCount(mangaId: string): Promise<void>
async decrementLikeCount(mangaId: string): Promise<void>
async incrementFavoriteCount(mangaId: string): Promise<void>
async decrementFavoriteCount(mangaId: string): Promise<void>
```

#### 排行榜查询
```typescript
async getPopularMangas(limit = 16): Promise<MangaEntity[]>
async getMostLikedMangas(limit = 16): Promise<MangaEntity[]>
async getMostFavoritedMangas(limit = 16): Promise<MangaEntity[]>
```

## 性能考虑

### 1. 索引优化
- 为每个统计字段添加单独索引
- 添加复合索引支持排序查询
- 考虑查询模式选择合适的索引类型

### 2. 查询优化
- 使用数据库的原子操作（increment/decrement）
- 避免在统计字段上使用复杂的计算
- 考虑使用缓存减少数据库压力

### 3. 扩展性
- 当前设计支持中等规模的并发访问
- 如果数据量增长，可以考虑读写分离
- 统计字段可以考虑使用Redis等缓存系统

## 使用示例

### 1. 增加观看数量
```bash
curl -X POST http://localhost:3000/mangas/{mangaId}/view
```

### 2. 查询热门漫画
```bash
curl -X GET "http://localhost:3000/mangas/popular?limit=20"
```

### 3. 按观看数量筛选
```bash
curl -X GET "http://localhost:3000/mangas?min_view_count=1000&max_view_count=5000"
```

## 注意事项

1. **数据一致性**：使用数据库的原子操作确保统计准确性
2. **性能监控**：定期监控统计字段的查询性能
3. **数据备份**：确保统计数据的定期备份
4. **权限控制**：统计操作可能需要适当的权限验证

## 未来扩展

如果业务需求增长，可以考虑以下优化：

1. **读写分离**：将统计操作分离到专门的统计表
2. **缓存层**：使用Redis缓存热门统计信息
3. **异步处理**：使用消息队列异步更新统计
4. **分片策略**：按漫画ID进行分片存储

