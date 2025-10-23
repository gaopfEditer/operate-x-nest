-- 添加漫画统计字段
-- 创建时间: 2025-01-20
-- 描述: 为漫画表添加观看数量、点赞数量、收藏数量字段

-- 添加统计字段到漫画表
ALTER TABLE `mangas`
ADD COLUMN `view_count` bigint NOT NULL DEFAULT '0' COMMENT '观看数量' AFTER `recommended`,
ADD COLUMN `like_count` bigint NOT NULL DEFAULT '0' COMMENT '点赞数量' AFTER `view_count`,
ADD COLUMN `favorite_count` bigint NOT NULL DEFAULT '0' COMMENT '收藏数量' AFTER `like_count`;

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

