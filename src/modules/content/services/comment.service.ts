import { Injectable } from '@nestjs/common';

import { isNil } from 'lodash';

import { EntityNotFoundError, In } from 'typeorm';

import { ClassToPlain } from '@/modules/core/types';
import { manualPaginate } from '@/modules/database/helpers';

import { UserEntity } from '@/modules/user/entities';
import { UserService } from '@/modules/user/services';

import { CreateCommentDto, QueryCommentDto } from '../dtos/comment.dto';
import { ManageQueryCommentDto } from '../dtos/manage/query-comment.dto';
import { CommentEntity } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';

/**
 * @description 评论服务
 * @export
 * @class CommentService
 */
@Injectable()
export class CommentService {
    constructor(
        protected commentRepository: CommentRepository,
        protected postRepository: PostRepository,
        protected userService: UserService,
    ) {}

    async findTrees({ post, category, targetId }: { post?: string; category?: string; targetId?: string }) {
        return this.commentRepository.findTrees({ post, category, targetId });
    }

    /**
     * 查找评论列表
     * @param dto
     */
    async paginate(dto: ManageQueryCommentDto | QueryCommentDto) {
        const { post, user, category, targetId, ...query } = dto as ManageQueryCommentDto;
        const data = await this.commentRepository.findRoots({
            addQuery: (qb) => {
                const condition: Record<string, any> = {};
                if (!isNil(post)) condition.post = post;
                if (!isNil(user)) condition.user = user;
                if (!isNil(category)) condition.category = category;
                if (!isNil(targetId)) condition.targetId = targetId;
                return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
            },
        });
        let comments: CommentEntity[] = [];
        for (let i = 0; i < data.length; i++) {
            const c = data[i];
            comments.push(await this.commentRepository.findDescendantsTree(c));
        }
        comments = await this.commentRepository.toFlatTrees(comments);
        return manualPaginate(query, comments);
    }

    /**
     * @description 新增评论
     * @param {CreateCommentDto} data
     */
    async create(data: CreateCommentDto, user: ClassToPlain<UserEntity>) {
        const createData: any = {
            ...data,
            parent: await this.getParent(data.parent),
            user: await this.userService.getCurrentUser(user),
        };

        // 只有当category为post时才关联post
        if (data.category === 'post' && data.post) {
            createData.post = await this.getPost(data.post);
        }

        const item = await this.commentRepository.save(createData);
        return this.commentRepository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * 删除评论
     * @param items
     */
    async delete(items: string[]) {
        const comments = await this.commentRepository.findOneOrFail({ where: { id: In(items) } });
        return this.commentRepository.remove(comments);
    }

    /**
     * @description 获取评论所属文章实例
     * @protected
     * @param {string} id
     */
    protected async getPost(id: string) {
        return this.postRepository.findOneOrFail({ where: { id } });
    }

    /**
     * @description 获取请求传入的父评论
     * @protected
     * @param {string} [id]
     */
    protected async getParent(id?: string) {
        let parent: CommentEntity | undefined;
        if (id !== undefined) {
            if (id === null) return null;
            parent = await this.commentRepository.findOne({ where: { id } });
            if (!parent) {
                throw new EntityNotFoundError(CommentEntity, `Parent comment ${id} not exists!`);
            }
        }
        return parent;
    }
}
