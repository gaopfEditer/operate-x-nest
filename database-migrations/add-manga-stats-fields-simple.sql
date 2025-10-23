-- 添加漫画统计字段（简化版）
-- 创建时间: 2025-01-20
-- 描述: 为漫画表添加观看数量、点赞数量、收藏数量字段（仅添加字段，不添加索引）

-- 添加统计字段到漫画表
ALTER TABLE `mangas`
ADD COLUMN `view_count` bigint NOT NULL DEFAULT '0' COMMENT '观看数量' AFTER `recommended`,
ADD COLUMN `like_count` bigint NOT NULL DEFAULT '0' COMMENT '点赞数量' AFTER `view_count`,
ADD COLUMN `favorite_count` bigint NOT NULL DEFAULT '0' COMMENT '收藏数量' AFTER `like_count`;
