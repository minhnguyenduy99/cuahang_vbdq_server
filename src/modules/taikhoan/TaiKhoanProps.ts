import { IsString, IsOptional, IsNumber, MaxLength, IsEmpty, IsNumberString } from "class-validator";
import { Expose, Transform, Exclude } from "class-transformer";
import { CreateType } from "@modules/core";

export default class TaiKhoanProps {

  @IsEmpty({ groups: [CreateType.getGroups().createNew, CreateType.getGroups().update] })
  @Expose({ groups: CreateType.getAllGroups() })
  id: string;

  @Expose({ name: "ten_tk", groups: CreateType.getAllGroupsExcept("toAppRespone") })
  @MaxLength(20, { groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().update] })
  tenTaiKhoan: string;

  @MaxLength(20, { groups: [CreateType.getGroups().createNew, CreateType.getGroups().update] })
  @Expose({ name: "mat_khau", groups: CreateType.getAllGroupsExcept("toAppRespone") })
  @IsOptional({ groups: [CreateType.getGroups().update] })
  matKhau: string;

  @Expose({ name: "anh_dai_dien", groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  anhDaiDien: string;

  @IsEmpty({ groups: [CreateType.getGroups().update] })
  @Expose({ name: "loai_tk", groups: CreateType.getAllGroups() })
  loaiTK: string;
}