import { IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique, isNotEmpty, } from "class-validator";
import { PostType } from "../entities/post.entity";
import { LocationInputDto } from "./locationInput.dto";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    declare title: string;

    @IsString()
    @IsOptional()
    declare description?: string;

    @IsEnum(PostType, { message: 'Type must be valid PostType' })
    declare type: PostType;

    @IsOptional()
    @IsString()
    declare mainImage?: string;

    @IsOptional()
    @IsString()
    declare extraImages: string[];

    // @IsArray()
    @IsNotEmpty()
    locationInputs: LocationInputDto[];

    @IsString({ message: 'SubCategoryName must be a string' })
    @IsNotEmpty({ message: 'SubCategoryName is required' })
    declare category: string;
}