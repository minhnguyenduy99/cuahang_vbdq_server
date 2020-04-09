import { IsString, IsNumber, IsInt, IsPositive, IsEmpty } from "class-validator";
import CreateType from "../entity-create-type";
import { Expose, Exclude } from "class-transformer";


export interface CTPhieuBanHangDTO {
  phieu_mh_id?: string;
  sp_id: string;
  so_luong: number;
  gia_tri: number;
}

export class CTPhieuBanHangProps {

  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "phieu_mh_id"})
  phieuMuaHangId: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "sp_id" })
  sanphamId: string;

  @IsInt({ groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups()})
  @Expose({ name: "so_luong" })
  soLuong: number;

  @IsInt({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsPositive({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "gia_tri" })
  giaTri: number;
}