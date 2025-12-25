import { Expose } from "class-transformer";

export class locationOutPutDto {
  @Expose()
  provinceName: string;

  @Expose()
  districtName: string
}
