import { IsString, IsOptional, IsNotEmpty, ValidateIf, IsNumberString, IsNumber, IsEmpty, Matches } from "class-validator";
import CreateType from "../entity-create-type";
import { Expose } from "class-transformer";


export interface KhachHangDTO {
  id: string;
  ten_kh: string;
  cmnd: string;
  tong_gia_tri_ban: number;
  tong_gia_tri_mua: number;
}

export class KhachHangProps {

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ten_kh" })
  ten: string;

  // @IsString({ groups: CreateType.getAllGroups() })
  // @IsNotEmpty({ groups: CreateType.getAllGroups() })
  // @Matches(/^\d{9,11}$/g, { groups: CreateType.getAllGroups() })
  cmnd: string;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "tong_gia_tri_ban" })
  tongGiaTriBan: number;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "tong_gia_tri_mua" })
  tongGiaTriMua: number;
}