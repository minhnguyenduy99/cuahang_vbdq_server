import { ChiTietPhieuProps } from "@modules/phieu/shared";
import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { CreateType } from "@modules/core";

export class ChiTietPhieuBHProps extends ChiTietPhieuProps {

  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "sp_id" })
  sanphamId: string;
}