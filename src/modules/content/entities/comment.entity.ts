import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    Tree,
    TreeChildren,
    TreeParent,
} from 'typeorm';

import { UserEntity } from '@/modules/user/entities';

import { PostEntity } from './post.entity';

/**
 * @description 树形嵌套评论
 * @export
 * @class CommentEntity
 * @extends {BaseEntity}
 */
@Exclude()
@Tree('materialized-path')
@Entity('content_comments')
export class CommentEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '评论内容', type: 'longtext' })
    body!: string;

    @Expose()
    @Column({
        comment: '评论类别',
        type: 'enum',
        enum: ['post', 'manga', 'novel', 'chapter'],
        default: 'post'
    })
    @Index()
    category!: string;

    @Expose()
    @Column({ comment: '关联内容ID', length: 36 })
    @Index()
    targetId!: string;

    /**
     * @description 评论与分类多对一
     * @type {PostEntity}
     */
    @Expose()
    @ManyToOne((type) => PostEntity, (post) => post.comments, {
        // 文章可以为空（当category不是post时）
        nullable: true,
        // 跟随父表删除与更新
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    post?: PostEntity;

    @Expose()
    @ManyToOne((type) => UserEntity, (user) => user.comments, {
        nullable: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user!: UserEntity;

    /**
     * @description 子评论
     * @type {CommentEntity[]}
     */
    @Expose()
    @TreeChildren({ cascade: true })
    children!: CommentEntity[];

    /**
     * @description 父评论
     * @type {(CommentEntity | null)}
     */
    @TreeParent({ onDelete: 'CASCADE' })
    parent!: CommentEntity | null;

    /**
     * 评论创建时间
     *
     * @type {Date}
     * @memberof CommentEntity
     */
    @Expose()
    @Type(() => Date)
    @CreateDateColumn({
        comment: '创建时间',
    })
    createdAt!: Date;
}
