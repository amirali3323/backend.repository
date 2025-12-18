import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PostStatus } from "src/common/enums";

export class UpdateStatusDto {
  @IsNotEmpty()
  status: PostStatus;

  @IsOptional()
  @IsString()
  message: string;
}
