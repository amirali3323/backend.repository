import { IsEnum, } from "class-validator";
import { DeletionReason } from "src/common/enums/deletion-reason.enum";

export class DeletePostDto {
  @IsEnum(DeletionReason)
  reason: DeletionReason;
}
