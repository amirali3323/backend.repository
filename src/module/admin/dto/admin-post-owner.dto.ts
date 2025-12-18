import { Expose } from "class-transformer";

export class AdminOwnerPostDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  createdAt: string;
}

