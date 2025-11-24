import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatepwnerClaimDto {
  /** Claim message provided by the user */
  @IsNotEmpty()
  @IsString()
  message: string;

  /** Optional image for the claim */
  @IsOptional()
  @IsString()
  claimImage: string;
}
