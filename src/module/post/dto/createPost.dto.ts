import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, } from "class-validator";
import { BooleanString, PostType } from "../entities/post.entity";
import { LocationInputDto } from "./locationInput.dto";
import { Transform } from "class-transformer";



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

    @IsNotEmpty()
    locationInputs: LocationInputDto[];

    @IsString({ message: 'SubCategoryName must be a string' })
    @IsNotEmpty({ message: 'SubCategoryName is required' })
    declare category: string;

    @Transform(({ value }) =>
        value === 'true' || value === true || value === 1 ? true : false,
    )
    @IsBoolean()
    @IsOptional()
    hidePhoneNumber: boolean = false;

    @Transform(({ value }) =>
        value === 'true' || value === true || value === 1 ? true : false,
    )
    @IsBoolean()
    @IsOptional()
    isWillingToChat: boolean = true;

    @IsOptional()
    rewardAmount: number;
}
