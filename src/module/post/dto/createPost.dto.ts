import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique, } from "class-validator";
import { PostType } from "../entities/post.entity";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(PostType, { message: 'Type must be valid PostType' })
    type: PostType;

    @IsOptional()
    @IsString()
    mainImage?: string;

    @IsArray({ message: 'Images must be an array of strings' })
    @ArrayNotEmpty({ message: 'Images array cannot be empty' })
    @ArrayUnique({ message: 'Images must be unique' })
    @IsString({ each: true, message: 'Each image must be a string' })
    extraImages: string[];

    @IsArray({ message: 'Districts must be an array of strings' })
    @ArrayNotEmpty({ message: 'At least one district must be selected' })
    @IsString({ each: true, message: 'Each district must be a string' })
    districtNames: string[];

    @IsString({ message: 'SubCategory must be a string' })
    @IsNotEmpty({ message: 'SubCategory is required' })
    subCategoryName: string;
}