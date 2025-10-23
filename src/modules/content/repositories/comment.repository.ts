import { isNil } from 'lodash';

import { SelectQueryBuilder } from 'typeorm';

import { BaseTreeRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';
import { TreeQueryParams } from '@/modules/database/types';

import { CommentEntity } from '../entities';

@CustomRepository(CommentEntity)
export class CommentRepository extends BaseTreeRepository<CommentEntity> {
    protected qbName = 'comment';

    protected orderBy = 'createdAt';

    buildBaseQuery(qb: SelectQueryBuilder<CommentEntity>): SelectQueryBuilder<CommentEntity> {
        return super
            .buildBaseQuery(qb)
            .leftJoinAndSelect(`${this.qbName}.post`, 'post')
            .leftJoinAndSelect(`${this.qbName}.user`, 'user');
    }

    async findTrees(
        params: TreeQueryParams<CommentEntity> & { post?: string; category?: string; targetId?: string } = {},
    ): Promise<CommentEntity[]> {
        return super.findTrees({
            ...params,
            addQuery: (qb) => {
                const conditions: string[] = [];
                const queryParams: Record<string, any> = {};

                if (!isNil(params.post)) {
                    conditions.push('post.id = :postId');
                    queryParams.postId = params.post;
                }

                if (!isNil(params.category)) {
                    conditions.push('comment.category = :category');
                    queryParams.category = params.category;
                }

                if (!isNil(params.targetId)) {
                    conditions.push('comment.targetId = :targetId');
                    queryParams.targetId = params.targetId;
                }

                return conditions.length > 0 ? qb.where(conditions.join(' AND '), queryParams) : qb;
            },
        });
    }
}
