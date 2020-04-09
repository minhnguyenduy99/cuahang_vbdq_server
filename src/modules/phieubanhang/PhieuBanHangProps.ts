import { IsString, IsEmpty, IsDateString, IsNotEmpty, IsInt, IsNumber, Validate } from "class-validator";
import CreateType from "../entity-create-type";
import { Type, Expose } from "class-transformer";
import { IsMoney } from "@modules/helpers/custom-validator";

export interface PhieuBanHangDTO {
  id: string;
  ngay_lap: Date;
  tong_gia_tri: number;
  kh_id: string;
  nv_id: string;
  loai_phieu: number;
}

export class PhieuBanHangProps {

  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  id: string;

  @Type(() => Date)
  @IsDateString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "ngay_lap" })
  ngayLap: Date;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "tong_gia_tri" })
  tongGiaTri: number;

  @IsString({ groups: CreateType.getAllGroups()})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "kh_id" })
  khachHangId: string;

  @IsString({ groups: CreateType.getAllGroups()})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "nv_id" })
  nhanvienId: string;

  @IsInt({ groups: CreateType.getAllGroups()})
  @Expose({ name: "loai_phieu" })
  loaiPheu: number;
}