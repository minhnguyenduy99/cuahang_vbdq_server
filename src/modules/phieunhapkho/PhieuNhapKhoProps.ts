import { PhieuProps } from "@modules/phieu/shared";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateType } from "@modules/core";
import { PhieuDTO } from "@modules/phieu/shared";

export interface PhieuNhapKhoDTO extends PhieuDTO {
  nhacc_id: string;
}

export class PhieuNhapKhoProps extends PhieuProps {

  @Expose({ name: "nhacc_id" })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @IsString({ groups: CreateType.getAllGroups() })
  nhaccId: string;
}