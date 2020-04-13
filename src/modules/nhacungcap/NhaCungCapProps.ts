import { IsString, MaxLength, IsNumber, IsPositive, IsDivisibleBy, ValidatorConstraint, IsCurrency, IsOptional, IsNotEmpty, IsEmpty, IsInstance, registerDecorator, Validate } from "class-validator";
import { Expose, Exclude } from "class-transformer";
import CreateType from "../entity-create-type";
import { IsMoney, IsImage } from "@modules/helpers/custom-validator";


export default class NhaCungCapProps {

  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @Expose()
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @MaxLength(50, { groups: CreateType.getAllGroups() })
  @Expose()
  ten: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "dia_chi" })
  diaChi: string;

  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "anh_dai_dien" })
  @Validate(IsImage, { groups: CreateType.getAllGroupsExcept("createNew") })
  anhDaiDien: string;

  @Expose({ name: "tong_gia_tri_nhap" })
  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @IsNotEmpty({ groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  tongGiaTriNhap: number;
}