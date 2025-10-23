-- 添加推荐字段到漫画表
ALTER TABLE `mangas` ADD `recommended` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否推荐' AFTER `enabled`;
ALTER TABLE `mangas` ADD INDEX `IDX_MANGA_RECOMMENDED` (`recommended`);







