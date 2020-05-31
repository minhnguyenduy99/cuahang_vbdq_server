import { IsNotEmpty } from "class-validator";
import CreateType from "@create_type";
import { Expose } from "class-transformer";


export default class LoaiTaiKhoanProps {

  @Expose({ name: 'ma_ltk' })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  maLTK: string;

  @Expose({ name: 'ten_ltk' })
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  tenLTK: string;
}