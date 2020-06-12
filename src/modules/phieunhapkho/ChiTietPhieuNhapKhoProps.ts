import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import { ChiTietPhieuProps, ChiTietPhieuDTO } from "@modules/phieu/shared";
import { CreateType } from "@modules/core";

export interface ChiTietPhieuNhapKhoDTO extends ChiTietPhieuDTO{
  sp_id: string;
}

export class ChiTietPhieuNhapKhoProps extends ChiTietPhieuProps {
  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "sp_id" })
  sanphamId: string;
}