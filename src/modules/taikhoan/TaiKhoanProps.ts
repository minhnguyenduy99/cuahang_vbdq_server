import { IsString, IsOptional, IsNumber, MaxLength, IsIn, IsEmpty } from "class-validator";
import { Expose, Transform } from "class-transformer";
import CreateType from "../entity-create-type";

export default class TaiKhoanProps {

  @IsEmpty({ groups: [CreateType.getGroups().createNew] })
  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ groups: CreateType.getAllGroups() })
  id: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @Expose({ name: "ten_tk", groups: CreateType.getAllGroupsExcept("toAppRespone") })
  @MaxLength(20, { groups: CreateType.getAllGroups() })
  tenTaiKhoan: string;

  @IsString({ groups: CreateType.getAllGroups() })
  @MaxLength(20, { groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "mat_khau", groups: CreateType.getAllGroupsExcept("toAppRespone") })
  matKhau: string;

  @Expose({ name: "anh_dai_dien", groups: CreateType.getAllGroups() })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  anhDaiDien: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { groups: CreateType.getAllGroups() })
  @Transform((val) => {
    if (typeof val === "string") {
      return parseInt(val)
    }
    return val
  })
  @Expose({ name: "loai_tk", groups: CreateType.getAllGroups() })
  // @IsIn([0, 1, 2], { groups: CreateType.getAllGroups() })
  loaiTK: number;
}