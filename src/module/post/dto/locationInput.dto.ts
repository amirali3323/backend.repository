import { IsNotEmpty, IsString } from "class-validator";

export class LocationInputDto {
  @IsNotEmpty()
  @IsString()
  cityName: string;

  @IsNotEmpty()
  @IsString()
  districtName: string;
}