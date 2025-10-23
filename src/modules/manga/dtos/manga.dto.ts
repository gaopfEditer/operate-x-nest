import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { ListQueryDto } from '@/modules/restful/dtos';

import { MangaDtoGroups } from '../constants';

/**
 * 创建漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.CREATE] })
export class CreateMangaDto {
    @ApiProperty({ description: '漫画标题', maxLength: 200 })
    @IsString()
    @Length(1, 200, { message: '漫画标题长度必须在1-200个字符之间' })
    title!: string;

    @ApiPropertyOptional({ description: '源站URL' })
    @IsOptional()
    @IsUrl({}, { message: '源站URL格式不正确' })
    @Length(1, 500)
    source_url?: string;

    @ApiPropertyOptional({ description: '封面图片URL' })
    @IsOptional()
    @IsUrl({}, { message: '封面图片URL格式不正确' })
    @Length(1, 500)
    cover?: string;

    @ApiPropertyOptional({ description: '作者', maxLength: 100 })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    author?: string;

    @ApiPropertyOptional({ description: '总章节数', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '总章节数必须是数字' })
    @Min(0)
    total_chapters?: number;

    @ApiPropertyOptional({
        description: '连载状态',
        enum: ['连载中', '已完结', '暂停更新'],
        default: '连载中',
    })
    @IsOptional()
    @IsEnum(['连载中', '已完结', '暂停更新'])
    status?: string;

    @ApiPropertyOptional({ description: '标签', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: '分类', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiPropertyOptional({ description: '描述' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: '生成时间' })
    @IsDateString({}, { message: '生成时间格式不正确' })
    generated_time!: string;

    @ApiPropertyOptional({ description: '爬取统计' })
    @IsOptional()
    crawl_statistics?: {
        success_chapters: number;
        failed_chapters: number;
        success_rate: number;
        success_list: Array<{
            name: string;
            url: string;
            images: number;
        }>;
    };

    @ApiPropertyOptional({ description: '是否启用', default: true })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @ApiPropertyOptional({ description: '是否推荐', default: false })
    @IsOptional()
    @IsBoolean()
    recommended?: boolean;

    @ApiPropertyOptional({ description: '观看数量', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '观看数量必须是数字' })
    @Min(0)
    view_count?: number;

    @ApiPropertyOptional({ description: '点赞数量', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '点赞数量必须是数字' })
    @Min(0)
    like_count?: number;

    @ApiPropertyOptional({ description: '收藏数量', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '收藏数量必须是数字' })
    @Min(0)
    favorite_count?: number;
}

/**
 * 更新漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.UPDATE] })
export class UpdateMangaDto extends CreateMangaDto {
    @ApiPropertyOptional({ description: '漫画ID' })
    @IsOptional()
    @IsString()
    id?: string;
}

/**
 * 查询漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.QUERY] })
export class QueryMangaDto extends ListQueryDto {
    @ApiPropertyOptional({ description: '漫画标题' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: '作者' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ description: '连载状态' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '标签' })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiPropertyOptional({ description: '分类' })
    @IsOptional()
    @IsString()
    categories?: string;

    @ApiPropertyOptional({ description: '最小章节数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_chapters?: number;

    @ApiPropertyOptional({ description: '最大章节数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_chapters?: number;

    @ApiPropertyOptional({ description: '是否启用' })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    enabled?: boolean;

    @ApiPropertyOptional({ description: '是否推荐' })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    recommended?: boolean;

    @ApiPropertyOptional({ description: '最小观看数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_view_count?: number;

    @ApiPropertyOptional({ description: '最大观看数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_view_count?: number;

    @ApiPropertyOptional({ description: '最小点赞数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_like_count?: number;

    @ApiPropertyOptional({ description: '最大点赞数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_like_count?: number;

    @ApiPropertyOptional({ description: '最小收藏数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_favorite_count?: number;

    @ApiPropertyOptional({ description: '最大收藏数量' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_favorite_count?: number;
}

/**
 * 更新图片DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.UPDATE] })
export class UpdateImageDto {
    @ApiPropertyOptional({ description: '图片URL', maxLength: 500 })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    image_url?: string;

    @ApiPropertyOptional({ description: '本地存储路径', maxLength: 500 })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    local_path?: string;

    @ApiPropertyOptional({ description: '图片排序', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '图片排序必须是数字' })
    @Min(0)
    image_order?: number;

    @ApiPropertyOptional({ description: '图片宽度', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '图片宽度必须是数字' })
    @Min(0)
    width?: number;

    @ApiPropertyOptional({ description: '图片高度', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '图片高度必须是数字' })
    @Min(0)
    height?: number;

    @ApiPropertyOptional({ description: '文件大小(字节)', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '文件大小必须是数字' })
    @Min(0)
    file_size?: number;

    @ApiPropertyOptional({ description: '图片格式', maxLength: 10 })
    @IsOptional()
    @IsString()
    @Length(1, 10)
    format?: string;

    @ApiPropertyOptional({ description: '是否已下载' })
    @IsOptional()
    @IsBoolean()
    downloaded?: boolean;

    @ApiPropertyOptional({ description: '是否启用' })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}

/**
 * 更新章节DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.UPDATE] })
export class UpdateChapterDto {
    @ApiPropertyOptional({ description: '章节名称', maxLength: 200 })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    chapter_name?: string;

    @ApiPropertyOptional({ description: '章节URL', maxLength: 500 })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    chapter_url?: string;

    @ApiPropertyOptional({ description: '章节排序', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '章节排序必须是数字' })
    @Min(0)
    sort_order?: number;

    @ApiPropertyOptional({ description: '图片数量', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '图片数量必须是数字' })
    @Min(0)
    image_count?: number;

    @ApiPropertyOptional({ description: '是否已爬取图片' })
    @IsOptional()
    @IsBoolean()
    images_crawled?: boolean;

    @ApiPropertyOptional({ description: '是否启用' })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}

/**
 * 创建章节DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.CREATE] })
export class CreateChapterDto {
    @ApiProperty({ description: '章节名称', maxLength: 200 })
    @IsString()
    @Length(1, 200, { message: '章节名称长度必须在1-200个字符之间' })
    chapter_name!: string;

    @ApiPropertyOptional({ description: '章节URL', maxLength: 500 })
    @IsOptional()
    @IsString()
    @Length(1, 500)
    chapter_url?: string;

    @ApiPropertyOptional({ description: '章节排序', minimum: 0, default: 0 })
    @IsOptional()
    @IsNumber({}, { message: '章节排序必须是数字' })
    @Min(0)
    sort_order?: number;

    @ApiPropertyOptional({ description: '图片数量', minimum: 0, default: 0 })
    @IsOptional()
    @IsNumber({}, { message: '图片数量必须是数字' })
    @Min(0)
    image_count?: number;

    @ApiPropertyOptional({ description: '是否已爬取图片', default: false })
    @IsOptional()
    @IsBoolean()
    images_crawled?: boolean;

    @ApiPropertyOptional({ description: '是否启用', default: true })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}
