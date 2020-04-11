import { IsString, IsOptional, IsNotEmpty, ValidateIf, IsNumberString, IsNumber, IsEmpty, Matches, Validate } from "class-validator";
import CreateType from "../entity-create-type";
import { Expose } from "class-transformer";
import { IsCMND, IsMoney } from "../helpers/custom-validator";


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
  @Expose({ groups: CreateType.getAllGroups() })
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ten_kh" })
  ten: string;

  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Validate(IsCMND, { groups: CreateType.getAllGroups() })
  @Expose({ groups: CreateType.getAllGroups() })
  cmnd: string;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroups() })
  @Expose({ name: "tong_gia_tri_ban" })
  tongGiaTriBan: number;

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Validate(IsMoney, { groups: CreateType.getAllGroups() })
  @Expose({ name: "tong_gia_tri_mua" })
  tongGiaTriMua: number;
}