import { IsString, MaxLength, IsNumber, IsPositive, IsDivisibleBy, ValidatorConstraint, IsCurrency, IsOptional, IsNotEmpty, IsEmpty, IsInstance } from "class-validator";
import { Expose } from "class-transformer";
import CreateType from "../entity-create-type";


export default class NhaCungCapProps {

  @IsString({ groups: CreateType.getAllGroups() })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @MaxLength(50, { groups: CreateType.getAllGroups() })
  ten: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "dia_chi" })
  diaChi: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "anh_dai_dien" })
  anhDaiDien: string;

  @IsNumber({ allowInfinity: false, allowNaN: false}, { groups: CreateType.getAllGroups() })
  @IsPositive({ groups: CreateType.getAllGroups() })
  @IsDivisibleBy(1000, { groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "tong_gia_tri_nhap" })
  tongGiaTriNhap: number;
}