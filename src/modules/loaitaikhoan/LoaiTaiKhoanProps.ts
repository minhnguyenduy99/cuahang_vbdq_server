import { IsNotEmpty } from "class-validator";
import { Expose } from "class-transformer";
import { CreateType } from "@modules/core";


export default class LoaiTaiKhoanProps {

  @Expose({ name: 'ma_ltk' })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  maLTK: string;

  @Expose({ name: 'ten_ltk' })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  tenLTK: string;
}