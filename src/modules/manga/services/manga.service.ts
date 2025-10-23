import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { BaseService } from '@/modules/database/base';
import { IPaginateDto } from '@/modules/database/types';

import {
    CreateMangaDto,
    QueryMangaDto,
    UpdateMangaDto,
    UpdateImageDto,
    UpdateChapterDto,
    CreateChapterDto,
} from '../dtos/manga.dto';
import { MangaChapterEntity } from '../entities/manga-chapter.entity';
import { MangaImageEntity } from '../entities/manga-image.entity';
import { MangaEntity } from '../entities/manga.entity';
import { MangaRepository } from '../repositories/manga.repository';

/**
 * 漫画服务
 */
@Injectable()
export class MangaService extends BaseService<MangaEntity, MangaRepository> {
    constructor(
        protected readonly mangaRepository: MangaRepository,
        @InjectRepository(MangaChapterEntity)
        protected readonly chapterRepository: Repository<MangaChapterEntity>,
        @InjectRepository(MangaImageEntity)
        protected readonly imageRepository: Repository<MangaImageEntity>,
    ) {
        super(mangaRepository);
    }

    /**
     * 创建漫画
     */
    async create(data: CreateMangaDto): Promise<MangaEntity> {
        const manga = this.mangaRepository.create({
            ...data,
            generated_time: new Date(data.generated_time),
        });
        return this.mangaRepository.save(manga);
    }

    /**
     * 更新漫画
     */
    async update(id: string, data: UpdateMangaDto): Promise<MangaEntity> {
        const updateData: any = { ...data };
        if (data.generated_time) {
            updateData.generated_time = new Date(data.generated_time);
        }

        await this.mangaRepository.update(id, updateData);
        return this.detail(id);
    }

    /**
     * 分页查询漫画
     */
    async paginate(options: IPaginateDto<IPaginationMeta> & QueryMangaDto) {
        const queryBuilder = this.mangaRepository.buildBaseQuery();

        // 添加搜索条件
        if (options.title) {
            queryBuilder.andWhere('manga.title LIKE :title', { title: `%${options.title}%` });
        }

        if (options.author) {
            queryBuilder.andWhere('manga.author LIKE :author', { author: `%${options.author}%` });
        }

        if (options.status) {
            queryBuilder.andWhere('manga.status = :status', { status: options.status });
        }

        if (options.tags) {
            queryBuilder.andWhere('JSON_CONTAINS(manga.tags, :tags)', {
                tags: JSON.stringify(options.tags),
            });
        }

        if (options.categories) {
            queryBuilder.andWhere('JSON_CONTAINS(manga.categories, :categories)', {
                categories: JSON.stringify(options.categories),
            });
        }

        if (options.min_chapters !== undefined) {
            queryBuilder.andWhere('manga.total_chapters >= :min_chapters', {
                min_chapters: options.min_chapters,
            });
        }

        if (options.max_chapters !== undefined) {
            queryBuilder.andWhere('manga.total_chapters <= :max_chapters', {
                max_chapters: options.max_chapters,
            });
        }

        if (options.enabled !== undefined) {
            queryBuilder.andWhere('manga.enabled = :enabled', { enabled: options.enabled });
        }

        if (options.recommended !== undefined) {
            queryBuilder.andWhere('manga.recommended = :recommended', {
                recommended: options.recommended,
            });
        }

        if (options.min_view_count !== undefined) {
            queryBuilder.andWhere('manga.view_count >= :min_view_count', {
                min_view_count: options.min_view_count,
            });
        }

        if (options.max_view_count !== undefined) {
            queryBuilder.andWhere('manga.view_count <= :max_view_count', {
                max_view_count: options.max_view_count,
            });
        }

        if (options.min_like_count !== undefined) {
            queryBuilder.andWhere('manga.like_count >= :min_like_count', {
                min_like_count: options.min_like_count,
            });
        }

        if (options.max_like_count !== undefined) {
            queryBuilder.andWhere('manga.like_count <= :max_like_count', {
                max_like_count: options.max_like_count,
            });
        }

        if (options.min_favorite_count !== undefined) {
            queryBuilder.andWhere('manga.favorite_count >= :min_favorite_count', {
                min_favorite_count: options.min_favorite_count,
            });
        }

        if (options.max_favorite_count !== undefined) {
            queryBuilder.andWhere('manga.favorite_count <= :max_favorite_count', {
                max_favorite_count: options.max_favorite_count,
            });
        }

        // 排序
        queryBuilder.orderBy('manga.createdAt', 'DESC');

        return super.paginate(options, async (qb) => {
            // 应用自定义查询条件
            if (options.title) {
                qb.andWhere('manga.title LIKE :title', { title: `%${options.title}%` });
            }
            if (options.author) {
                qb.andWhere('manga.author LIKE :author', { author: `%${options.author}%` });
            }
            if (options.status) {
                qb.andWhere('manga.status = :status', { status: options.status });
            }
            if (options.tags) {
                qb.andWhere('JSON_CONTAINS(manga.tags, :tags)', {
                    tags: JSON.stringify(options.tags),
                });
            }
            if (options.categories) {
                qb.andWhere('JSON_CONTAINS(manga.categories, :categories)', {
                    categories: JSON.stringify(options.categories),
                });
            }
            if (options.min_chapters !== undefined) {
                qb.andWhere('manga.total_chapters >= :min_chapters', {
                    min_chapters: options.min_chapters,
                });
            }
            if (options.max_chapters !== undefined) {
                qb.andWhere('manga.total_chapters <= :max_chapters', {
                    max_chapters: options.max_chapters,
                });
            }
            if (options.enabled !== undefined) {
                qb.andWhere('manga.enabled = :enabled', { enabled: options.enabled });
            }
            if (options.recommended !== undefined) {
                qb.andWhere('manga.recommended = :recommended', {
                    recommended: options.recommended,
                });
            }
            if (options.min_view_count !== undefined) {
                qb.andWhere('manga.view_count >= :min_view_count', {
                    min_view_count: options.min_view_count,
                });
            }
            if (options.max_view_count !== undefined) {
                qb.andWhere('manga.view_count <= :max_view_count', {
                    max_view_count: options.max_view_count,
                });
            }
            if (options.min_like_count !== undefined) {
                qb.andWhere('manga.like_count >= :min_like_count', {
                    min_like_count: options.min_like_count,
                });
            }
            if (options.max_like_count !== undefined) {
                qb.andWhere('manga.like_count <= :max_like_count', {
                    max_like_count: options.max_like_count,
                });
            }
            if (options.min_favorite_count !== undefined) {
                qb.andWhere('manga.favorite_count >= :min_favorite_count', {
                    min_favorite_count: options.min_favorite_count,
                });
            }
            if (options.max_favorite_count !== undefined) {
                qb.andWhere('manga.favorite_count <= :max_favorite_count', {
                    max_favorite_count: options.max_favorite_count,
                });
            }
            return qb;
        });
    }

    /**
     * 获取漫画章节列表
     */
    async getChapters(mangaId: string): Promise<MangaChapterEntity[]> {
        return this.chapterRepository.find({
            where: { manga_id: mangaId, enabled: true },
            order: { sort_order: 'ASC', createdAt: 'ASC' },
        });
    }

    /**
     * 创建漫画章节
     */
    async createChapter(mangaId: string, data: CreateChapterDto): Promise<MangaChapterEntity> {
        // 验证漫画是否存在
        const manga = await this.detail(mangaId);
        if (!manga) {
            throw new Error('漫画不存在');
        }

        // 创建章节
        const chapter = this.chapterRepository.create({
            manga_id: mangaId,
            chapter_name: data.chapter_name,
            chapter_url: data.chapter_url,
            sort_order: data.sort_order ?? 0,
            image_count: data.image_count ?? 0,
            images_crawled: data.images_crawled ?? false,
            enabled: data.enabled ?? true,
        });

        return this.chapterRepository.save(chapter);
    }

    /**
     * 获取漫画章节信息
     */
    async getChapter(mangaId: string, chapterId: string): Promise<MangaChapterEntity> {
        const chapter = await this.chapterRepository
            .createQueryBuilder('chapter')
            .leftJoinAndSelect('chapter.manga', 'manga')
            .where('chapter.id = :chapterId', { chapterId })
            .andWhere('manga.id = :mangaId', { mangaId })
            .andWhere('chapter.enabled = :enabled', { enabled: true })
            .getOne();

        if (!chapter) {
            throw new Error('章节不存在');
        }

        return chapter;
    }

    /**
     * 获取漫画章节图片列表
     */
    async getChapterImages(mangaId: string, chapterId: string): Promise<MangaImageEntity[]> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        return this.imageRepository.find({
            where: { chapter_id: chapterId, enabled: true },
            order: { image_order: 'ASC' },
        });
    }

    /**
     * 获取漫画图片
     */
    async getImage(mangaId: string, chapterId: string, imageId: string): Promise<MangaImageEntity> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        const image = await this.imageRepository.findOne({
            where: { id: imageId, chapter_id: chapterId, enabled: true },
        });

        if (!image) {
            throw new Error('图片不存在');
        }

        return image;
    }

    /**
     * 批量创建章节和图片
     */
    async createChaptersAndImages(
        mangaId: string,
        chaptersData: Array<{
            chapter_name: string;
            chapter_url?: string;
            sort_order?: number;
            images: Array<{
                image_url: string;
                image_order?: number;
                width?: number;
                height?: number;
                file_size?: number;
                format?: string;
            }>;
        }>,
    ): Promise<void> {
        for (let i = 0; i < chaptersData.length; i++) {
            const chapterData = chaptersData[i];
            const chapter = this.chapterRepository.create({
                manga_id: mangaId,
                chapter_name: chapterData.chapter_name,
                chapter_url: chapterData.chapter_url,
                sort_order: chapterData.sort_order ?? i,
                image_count: chapterData.images.length,
            });
            const savedChapter = await this.chapterRepository.save(chapter);

            for (let j = 0; j < chapterData.images.length; j++) {
                const imageData = chapterData.images[j];
                const image = this.imageRepository.create({
                    chapter_id: savedChapter.id,
                    image_url: imageData.image_url,
                    image_order: imageData.image_order ?? j,
                    width: imageData.width,
                    height: imageData.height,
                    file_size: imageData.file_size,
                    format: imageData.format,
                });
                await this.imageRepository.save(image);
            }
        }
    }

    /**
     * 更新图片下载状态
     */
    async updateImageDownloadStatus(
        imageId: string,
        localPath: string,
        fileSize?: number,
    ): Promise<MangaImageEntity> {
        await this.imageRepository.update(imageId, {
            local_path: localPath,
            downloaded: true,
            download_time: new Date(),
            file_size: fileSize,
        });
        return this.imageRepository.findOneOrFail({ where: { id: imageId } });
    }

    /**
     * 更新章节爬取状态
     */
    async updateChapterCrawlStatus(
        chapterId: string,
        imageCount: number,
    ): Promise<MangaChapterEntity> {
        await this.chapterRepository.update(chapterId, {
            image_count: imageCount,
            images_crawled: true,
            crawl_time: new Date(),
        });
        return this.chapterRepository.findOneOrFail({ where: { id: chapterId } });
    }

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

        // 构建查询条件
        const whereConditions: any = {
            enabled: true,
        };

        // 如果有类别参数，优先使用推荐+类别的组合
        if (category) {
            whereConditions.recommended = true;
            whereConditions.categories = category;
        } else {
            // 如果没有类别参数，使用推荐状态
            whereConditions.recommended = true;
        }

        // 如果有标签参数，添加标签过滤
        if (tags && tags.length > 0) {
            whereConditions.tags = tags;
        }

        // 构建查询
        let queryBuilder = this.mangaRepository.createQueryBuilder('manga').where(whereConditions);

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

        // 如果启用随机排序
        if (random) {
            queryBuilder = queryBuilder.orderBy('RAND()');
        } else {
            queryBuilder = queryBuilder.orderBy('manga.createdAt', 'DESC');
        }

        // 限制结果数量
        queryBuilder = queryBuilder.limit(limit);

        return queryBuilder.getMany();
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

        // 构建查询条件
        const whereConditions: any = {
            enabled: true,
        };

        // 如果排除推荐漫画
        if (excludeRecommended) {
            whereConditions.recommended = false;
        }

        // 构建查询
        let queryBuilder = this.mangaRepository.createQueryBuilder('manga').where(whereConditions);

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

        // 随机排序
        queryBuilder = queryBuilder.orderBy('RAND()');

        // 限制结果数量
        queryBuilder = queryBuilder.limit(limit);

        return queryBuilder.getMany();
    }

    /**
     * 增加观看数量
     */
    async incrementViewCount(mangaId: string): Promise<void> {
        await this.mangaRepository.increment({ id: mangaId }, 'view_count', 1);
    }

    /**
     * 增加点赞数量
     */
    async incrementLikeCount(mangaId: string): Promise<void> {
        await this.mangaRepository.increment({ id: mangaId }, 'like_count', 1);
    }

    /**
     * 减少点赞数量
     */
    async decrementLikeCount(mangaId: string): Promise<void> {
        await this.mangaRepository.decrement({ id: mangaId }, 'like_count', 1);
    }

    /**
     * 增加收藏数量
     */
    async incrementFavoriteCount(mangaId: string): Promise<void> {
        await this.mangaRepository.increment({ id: mangaId }, 'favorite_count', 1);
    }

    /**
     * 减少收藏数量
     */
    async decrementFavoriteCount(mangaId: string): Promise<void> {
        await this.mangaRepository.decrement({ id: mangaId }, 'favorite_count', 1);
    }

    /**
     * 获取热门漫画列表（按观看数量排序）
     */
    async getPopularMangas(limit = 16): Promise<MangaEntity[]> {
        return this.mangaRepository.find({
            where: {
                enabled: true,
            },
            order: {
                view_count: 'DESC',
                createdAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 获取最受欢迎的漫画列表（按点赞数量排序）
     */
    async getMostLikedMangas(limit = 16): Promise<MangaEntity[]> {
        return this.mangaRepository.find({
            where: {
                enabled: true,
            },
            order: {
                like_count: 'DESC',
                createdAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 获取收藏最多的漫画列表（按收藏数量排序）
     */
    async getMostFavoritedMangas(limit = 16): Promise<MangaEntity[]> {
        return this.mangaRepository.find({
            where: {
                enabled: true,
            },
            order: {
                favorite_count: 'DESC',
                createdAt: 'DESC',
            },
            take: limit,
        });
    }

    /**
     * 更新漫画章节
     */
    async updateChapter(
        mangaId: string,
        chapterId: string,
        data: UpdateChapterDto,
    ): Promise<MangaChapterEntity> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        // 更新章节信息
        await this.chapterRepository.update(chapterId, data);

        // 返回更新后的章节信息
        return this.chapterRepository.findOneOrFail({ where: { id: chapterId } });
    }

    /**
     * 删除漫画章节
     */
    async deleteChapter(mangaId: string, chapterId: string): Promise<void> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        // 物理删除章节下的所有图片
        await this.imageRepository.delete({ chapter_id: chapterId });

        // 物理删除章节
        await this.chapterRepository.delete(chapterId);
    }

    /**
     * 删除漫画图片
     */
    async deleteImage(mangaId: string, chapterId: string, imageId: string): Promise<void> {
        // 验证图片是否属于该章节和漫画
        await this.getImage(mangaId, chapterId, imageId);

        // 软删除图片（设置enabled为false）
        await this.imageRepository.update(imageId, { enabled: false });
    }

    /**
     * 更新漫画图片
     */
    async updateImage(
        mangaId: string,
        chapterId: string,
        imageId: string,
        data: UpdateImageDto,
    ): Promise<MangaImageEntity> {
        // 验证图片是否属于该章节和漫画
        await this.getImage(mangaId, chapterId, imageId);

        // 更新图片信息
        await this.imageRepository.update(imageId, data);

        // 返回更新后的图片信息
        return this.imageRepository.findOneOrFail({ where: { id: imageId } });
    }
}
