import { IsNotEmpty, IsString } from "class-validator";

/** DTO for location data when creating a post */
export class LocationInputDto {
  /** Province name (e.g., Tehran) */
  @IsNotEmpty()
  @IsString()
  provinceName: string;

  /** District name within the province (e.g., Vanak) */
  @IsNotEmpty()
  @IsString()
  districtName: string;
}
