import uniqid from "uniqid";
import { IsString, IsOptional, IsNumber, MaxLength, IsIn } from "class-validator";
import { Expose, Exclude } from "class-transformer";
import CreateType from "../entity-create-type";

export default class TaiKhoanProps {

  @IsString()
  @Expose()
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  id: string;

  @IsString()
  @Expose({ name: "ten_tk" })
  @MaxLength(20)
  tenTaiKhoan: string;

  @IsString()
  @Expose({ name: "mat_khau"})
  @MaxLength(20)
  @Exclude({ toPlainOnly: true })
  matKhau: string;

  @Expose({ name: "anh_dai_dien" })
  @IsOptional({ groups: [CreateType.getGroups().createNew] })
  anhDaiDien: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Expose({ name: "loai_tk" })
  @IsIn([0, 1, 2])
  loaiTK: number;
}