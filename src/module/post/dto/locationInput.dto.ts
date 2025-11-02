import { IsNotEmpty, IsString } from "class-validator";

export class LocationInputDto {
  @IsNotEmpty()
  @IsString()
  provinceName: string;

  @IsNotEmpty()
  @IsString()
  districtName: string;
}