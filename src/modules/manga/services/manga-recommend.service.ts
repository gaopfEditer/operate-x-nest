import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MangaEntity } from '../entities/manga.entity';

/**
 * 漫画推荐服务
 */
@Injectable()
export class MangaRecommendService {
    constructor(
        @InjectRepository(MangaEntity)
        private readonly mangaRepository: Repository<MangaEntity>,
    ) {}

    /**
     * 获取推荐漫画列表
     */
    async getRecommendedMangas(
        limit = 12,
        options: {
            category?: string;
            tags?: string[];
            random?: boolean;
        } = {},
    ): Promise<MangaEntity[]> {
        const { category, tags, random = true } = options;

        console.log('=== 推荐漫画调试信息 ===');
        console.log('请求参数:', { limit, category, tags, random });

        // 直接使用Repository查询
        console.log('直接使用Repository查询');
        const allMangas = await this.mangaRepository.find();
        console.log('获取到的漫画数量:', allMangas.length);

        // 随机排序
        if (random) {
            allMangas.sort(() => Math.random() - 0.5);
        }

        // 返回指定数量的漫画
        const results = allMangas.slice(0, limit);
        console.log('最终返回数量:', results.length);
        console.log('=== 调试信息结束 ===');
        return results;
    }

    /**
     * 获取随机推荐漫画列表
     */
    async getRandomMangas(
        limit = 12,
        options: {
            category?: string;
            tags?: string[];
            excludeRecommended?: boolean;
        } = {},
    ): Promise<MangaEntity[]> {
        const { category, tags, excludeRecommended = false } = options;

        // 构建查询
        let queryBuilder = this.mangaRepository
            .createQueryBuilder('manga')
            .where('manga.enabled = :enabled', { enabled: true });

        // 如果排除推荐漫画
        if (excludeRecommended) {
            queryBuilder = queryBuilder.andWhere('manga.recommended = :recommended', {
                recommended: false,
            });
        }

        // 如果有类别参数，使用 JSON_CONTAINS 查询
        if (category) {
            queryBuilder = queryBuilder.andWhere('JSON_CONTAINS(manga.categories, :category)', {
                category: JSON.stringify(category),
            });
        }

        // 如果有标签参数，使用 JSON_CONTAINS 查询
        if (tags && tags.length > 0) {
            const tagConditions = tags
                .map((_, index) => `JSON_CONTAINS(manga.tags, :tag${index})`)
                .join(' OR ');

            queryBuilder = queryBuilder.andWhere(
                `(${tagConditions})`,
                tags.reduce((params, tag, index) => {
                    params[`tag${index}`] = JSON.stringify(tag);
                    return params;
                }, {} as any),
            );
        }

        // 使用更随机的排序方式
        queryBuilder = queryBuilder
            .orderBy('RAND()')
            .addOrderBy('manga.view_count', 'DESC') // 添加观看数作为次要排序
            .addOrderBy('manga.createdAt', 'DESC'); // 添加创建时间作为第三排序

        // 限制结果数量
        queryBuilder = queryBuilder.limit(limit);

        return queryBuilder.getMany();
    }

    /**
     * 获取增强随机漫画列表（确保数量充足）
     */
    async getEnhancedRandomMangas(
        limit = 12,
        options: {
            category?: string;
            tags?: string[];
            excludeRecommended?: boolean;
        } = {},
    ): Promise<MangaEntity[]> {
        const { excludeRecommended = false } = options;

        // 首先尝试获取符合条件的漫画
        let results = await this.getRandomMangas(limit, options);

        // 如果数量不足，放宽条件重新获取
        if (results.length < limit) {
            const remainingLimit = limit - results.length;
            const excludeIds = results.map((manga) => manga.id);

            // 放宽条件：不限制类别和标签
            const additionalMangas = await this.getRandomMangas(remainingLimit, {
                excludeRecommended,
            });

            // 过滤掉重复的漫画
            const uniqueAdditionalMangas = additionalMangas.filter(
                (manga) => !excludeIds.includes(manga.id),
            );

            results = [...results, ...uniqueAdditionalMangas];
        }

        // 如果还是不足，获取所有可用的漫画
        if (results.length < limit) {
            const remainingLimit = limit - results.length;
            const excludeIds = results.map((manga) => manga.id);

            const fallbackMangas = await this.mangaRepository
                .createQueryBuilder('manga')
                .where('manga.enabled = :enabled', { enabled: true })
                .andWhere('manga.id NOT IN (:...excludeIds)', { excludeIds })
                .orderBy('RAND()')
                .limit(remainingLimit)
                .getMany();

            results = [...results, ...fallbackMangas];
        }

        return results;
    }

    /**
     * 获取数据统计信息
     */
    async getDebugInfo() {
        const totalCount = await this.mangaRepository.count({
            where: { enabled: true },
        });
        const recommendedCount = await this.mangaRepository.count({
            where: {
                enabled: true,
                recommended: true,
            },
        });
        const nonRecommendedCount = await this.mangaRepository.count({
            where: {
                enabled: true,
                recommended: false,
            },
        });

        return {
            total: totalCount,
            recommended: recommendedCount,
            nonRecommended: nonRecommendedCount,
            message: `数据库中共有 ${totalCount} 个启用的漫画，其中 ${recommendedCount} 个推荐，${nonRecommendedCount} 个非推荐`,
        };
    }
}
