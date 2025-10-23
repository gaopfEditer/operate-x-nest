-- 为评论表添加类别字段
ALTER TABLE `content_comments`
ADD COLUMN `category` ENUM('post', 'manga', 'novel', 'chapter') NOT NULL DEFAULT 'post' COMMENT '评论类别' AFTER `body`,
ADD COLUMN `target_id` VARCHAR(36) NOT NULL COMMENT '关联内容ID' AFTER `category`,
ADD INDEX `idx_category` (`category`),
ADD INDEX `idx_target_id` (`target_id`);

-- 更新现有数据，将post关联的内容ID设置为target_id
UPDATE `content_comments`
SET `target_id` = (
    SELECT `id`
    FROM `content_posts`
    WHERE `content_posts`.`id` = `content_comments`.`postId`
)
WHERE `postId` IS NOT NULL;

-- 为post类别的评论保持post关联
-- 其他类别的评论post字段将保持为NULL

