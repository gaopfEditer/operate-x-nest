import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    SerializeOptions,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateCommentDto, QueryCommentDto } from '@/modules/content/dtos';
import { CommentService } from '@/modules/content/services';
import { ClassToPlain } from '@/modules/core/types';
import { Depends } from '@/modules/restful/decorators';
import { Guest, ReqUser } from '@/modules/user/decorators';

import { UserEntity } from '@/modules/user/entities';

import { MangaModule } from '../manga.module';

/**
 * 漫画评论控制器
 */
@ApiTags('漫画评论')
@Depends(MangaModule)
@Controller('mangas/:mangaId/comments')
export class MangaCommentController {
    constructor(protected readonly commentService: CommentService) {}

    @Guest()
    @Get('tree')
    @ApiOperation({ summary: '查询漫画的评论,以树形嵌套结构展示' })
    @SerializeOptions({})
    async getMangaCommentsTree(@Param('mangaId', new ParseUUIDPipe()) mangaId: string) {
        return this.commentService.findTrees({
            category: 'manga',
            targetId: mangaId,
        });
    }

    @Guest()
    @Get()
    @ApiOperation({ summary: '查询漫画的评论列表,以分页模式展示' })
    @SerializeOptions({})
    async getMangaComments(
        @Param('mangaId', new ParseUUIDPipe()) mangaId: string,
        @Query() query: QueryCommentDto,
    ) {
        return this.commentService.paginate({
            ...query,
            category: 'manga',
            targetId: mangaId,
        });
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: '评论漫画' })
    async createMangaComment(
        @Param('mangaId', new ParseUUIDPipe()) mangaId: string,
        @Body() data: Omit<CreateCommentDto, 'category' | 'targetId'>,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        return this.commentService.create(
            {
                ...data,
                category: 'manga',
                targetId: mangaId,
            },
            user,
        );
    }
}
