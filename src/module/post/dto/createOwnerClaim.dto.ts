import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatepwnerClaimDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  claimImage: string;

}
