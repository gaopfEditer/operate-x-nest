import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Delete,
    Query,
    SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';
import { IPaginateDto } from '@/modules/database/types';
import { Depends } from '@/modules/restful/decorators';
import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import {
    CreateMangaDto,
    QueryMangaDto,
    UpdateMangaDto,
    UpdateImageDto,
    UpdateChapterDto,
    CreateChapterDto,
} from '../dtos/manga.dto';
import { MangaEntity } from '../entities/manga.entity';
import { MangaModule } from '../manga.module';
import { MangaRecommendService } from '../services/manga-recommend.service';
import { MangaSearchService } from '../services/manga-search.service';
import { MangaService } from '../services/manga.service';

/**
 * 漫画控制器
 */
@ApiTags('漫画操作')
@Depends(MangaModule)
@Controller('mangas')
export class MangaController {
    constructor(
        private readonly mangaService: MangaService,
        private readonly searchService: MangaSearchService,
        private readonly recommendService: MangaRecommendService,
    ) {}

    @Get()
    @Guest()
    @ApiOperation({ summary: '获取漫画列表' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getMangas(
        @Query() options: IPaginateDto & QueryMangaDto,
        @Query('pageSize') pageSize?: number,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        // 处理 pageSize 参数映射到 limit
        if (pageSize) {
            options.limit = pageSize;
        }
        return this.mangaService.paginate(options);
    }

    @Get('search')
    @Guest()
    @ApiOperation({ summary: '搜索漫画' })
    @SerializeOptions({ groups: ['manga-list'] })
    async search(
        @Query() filters: QueryMangaDto,
        @Query('q') query?: string,
        @Query('keyword') keyword?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
        @Query('sort') sort?: string,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        // 处理搜索关键词，支持 q 和 keyword 参数
        const searchQuery = query || keyword || '';

        // 处理分页参数
        const pageNum = page || 1;
        const size = pageSize || 12;
        const from = (pageNum - 1) * size;

        // 处理排序参数
        let sortField = 'created_at';
        let sortOrder = 'desc';

        if (sort) {
            switch (sort) {
                case 'hot':
                    sortField = 'view_count';
                    sortOrder = 'desc';
                    break;
                case 'new':
                    sortField = 'created_at';
                    sortOrder = 'desc';
                    break;
                case 'old':
                    sortField = 'created_at';
                    sortOrder = 'asc';
                    break;
                case 'chapters':
                    sortField = 'total_chapters';
                    sortOrder = 'desc';
                    break;
                default:
                    sortField = 'created_at';
                    sortOrder = 'desc';
            }
        }

        return this.searchService.searchMangas(searchQuery, {
            ...filters,
            from,
            size,
            sort: [{ [sortField]: { order: sortOrder } }],
        });
    }

    @Get('recommended')
    @Guest()
    @ApiOperation({ summary: '获取推荐漫画列表' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getRecommendedMangas(
        @Query('limit') limit = 12,
        @Query('category') category?: string,
        @Query('tags') tags?: string,
        @Query('random') random = true,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.recommendService.getRecommendedMangas(limit, {
            category,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : undefined,
            random,
        });
    }

    @Get('random')
    @Guest()
    @ApiOperation({ summary: '获取随机推荐漫画列表' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getRandomMangas(
        @Query('limit') limit = 12,
        @Query('category') category?: string,
        @Query('tags') tags?: string,
        @Query('excludeRecommended') excludeRecommended = false,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.recommendService.getEnhancedRandomMangas(limit, {
            category,
            tags: tags ? tags.split(',').map((tag) => tag.trim()) : undefined,
            excludeRecommended,
        });
    }

    @Get('popular')
    @Guest()
    @ApiOperation({ summary: '获取热门漫画列表（按观看数量排序）' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getPopularMangas(@Query('limit') limit = 16, @ReqUser() user?: ClassToPlain<UserEntity>) {
        return this.mangaService.getPopularMangas(limit);
    }

    @Get('most-liked')
    @Guest()
    @ApiOperation({ summary: '获取最受欢迎的漫画列表（按点赞数量排序）' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getMostLikedMangas(
        @Query('limit') limit = 16,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.getMostLikedMangas(limit);
    }

    @Get('most-favorited')
    @Guest()
    @ApiOperation({ summary: '获取收藏最多的漫画列表（按收藏数量排序）' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getMostFavoritedMangas(
        @Query('limit') limit = 16,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.getMostFavoritedMangas(limit);
    }

    @Get('stats')
    @Guest()
    @ApiOperation({ summary: '调试接口 - 查看数据统计' })
    async getDebugInfo() {
        return this.recommendService.getDebugInfo();
    }

    @Get('test-simple')
    @Guest()
    @ApiOperation({ summary: '测试简单查询' })
    async testSimpleQuery() {
        const allMangas = await this.mangaService.list();
        const enabledMangas = allMangas.filter((m) => m.enabled === true);
        const recommendedMangas = allMangas.filter((m) => m.recommended === true);

        return {
            total: allMangas.length,
            enabled: enabledMangas.length,
            recommended: recommendedMangas.length,
            enabledMangas: enabledMangas.map((m) => ({
                id: m.id,
                title: m.title,
                enabled: m.enabled,
                recommended: m.recommended,
            })),
        };
    }

    @Get(':id')
    @Guest()
    @ApiOperation({ summary: '获取漫画详情' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async getManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.detail(id);
    }

    @Post()
    @Guest()
    @ApiOperation({ summary: '创建漫画' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async createManga(
        @Body() data: CreateMangaDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<MangaEntity> {
        const manga = await this.mangaService.create(data);
        // 异步创建搜索索引
        this.searchService.indexManga(manga).catch(console.error);
        return manga;
    }

    @Put(':id')
    @Guest()
    @ApiOperation({ summary: '更新漫画' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async updateManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: UpdateMangaDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<MangaEntity> {
        const manga = await this.mangaService.update(id, data);
        // 异步更新搜索索引
        this.searchService.indexManga(manga).catch(console.error);
        return manga;
    }

    @Delete(':id')
    @Guest()
    @ApiOperation({ summary: '删除漫画' })
    async deleteManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        const result = await this.mangaService.delete([id], false);
        // 异步删除搜索索引
        this.searchService.deleteManga(id).catch(console.error);
        return result;
    }

    @Get(':id/chapters')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节列表' })
    async getChapters(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.mangaService.getChapters(id);
    }

    @Post(':id/chapters')
    @Guest()
    @ApiOperation({ summary: '创建漫画章节' })
    @SerializeOptions({ groups: ['chapter-detail'] })
    async createChapter(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: CreateChapterDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.createChapter(id, data);
    }

    @Get(':id/chapters/:chapterId')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节信息' })
    async getChapter(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
    ) {
        return this.mangaService.getChapter(id, chapterId);
    }

    @Get(':id/chapters/:chapterId/images')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节图片列表' })
    async getChapterImages(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
    ) {
        return this.mangaService.getChapterImages(id, chapterId);
    }

    @Get(':id/chapters/:chapterId/images/:imageId')
    @Guest()
    @ApiOperation({ summary: '获取漫画图片' })
    async getImage(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @Param('imageId', new ParseUUIDPipe()) imageId: string,
    ) {
        return this.mangaService.getImage(id, chapterId, imageId);
    }

    @Put(':id/chapters/:chapterId')
    @Guest()
    @ApiOperation({ summary: '编辑漫画章节' })
    @SerializeOptions({ groups: ['chapter-detail'] })
    async updateChapter(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @Body() data: UpdateChapterDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.updateChapter(id, chapterId, data);
    }

    @Delete(':id/chapters/:chapterId')
    @Guest()
    @ApiOperation({ summary: '删除漫画章节' })
    async deleteChapter(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        await this.mangaService.deleteChapter(id, chapterId);
        return { message: '章节删除成功' };
    }

    @Delete(':id/chapters/:chapterId/images/:imageId')
    @Guest()
    @ApiOperation({ summary: '删除漫画图片' })
    async deleteImage(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @Param('imageId', new ParseUUIDPipe()) imageId: string,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        await this.mangaService.deleteImage(id, chapterId, imageId);
        return { message: '图片删除成功' };
    }

    @Put(':id/chapters/:chapterId/images/:imageId')
    @Guest()
    @ApiOperation({ summary: '更新漫画图片' })
    @SerializeOptions({ groups: ['image-detail'] })
    async updateImage(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @Param('imageId', new ParseUUIDPipe()) imageId: string,
        @Body() data: UpdateImageDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.updateImage(id, chapterId, imageId, data);
    }

    @Post(':id/view')
    @Guest()
    @ApiOperation({ summary: '增加观看数量' })
    async incrementViewCount(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.mangaService.incrementViewCount(id);
        return { message: '观看数量已增加' };
    }

    @Post(':id/like')
    @Guest()
    @ApiOperation({ summary: '增加点赞数量' })
    async incrementLikeCount(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.mangaService.incrementLikeCount(id);
        return { message: '点赞数量已增加' };
    }

    @Delete(':id/like')
    @Guest()
    @ApiOperation({ summary: '减少点赞数量' })
    async decrementLikeCount(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.mangaService.decrementLikeCount(id);
        return { message: '点赞数量已减少' };
    }

    @Post(':id/favorite')
    @Guest()
    @ApiOperation({ summary: '增加收藏数量' })
    async incrementFavoriteCount(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.mangaService.incrementFavoriteCount(id);
        return { message: '收藏数量已增加' };
    }

    @Delete(':id/favorite')
    @Guest()
    @ApiOperation({ summary: '减少收藏数量' })
    async decrementFavoriteCount(@Param('id', new ParseUUIDPipe()) id: string) {
        await this.mangaService.decrementFavoriteCount(id);
        return { message: '收藏数量已减少' };
    }
}
