import { MaxLength, IsEmpty } from "class-validator";
import { Expose } from "class-transformer";
import { CreateType } from "@modules/core";

export default class TaiKhoanProps {

  @IsEmpty({ groups: [CreateType.getGroups().createNew, CreateType.getGroups().update] })
  @Expose({ groups: CreateType.getAllGroups() })
  id: string;

  @Expose({ name: "ten_tk", groups: CreateType.getAllGroupsExcept("toAppRespone") })
  @MaxLength(20, { groups: CreateType.getAllGroups() })
  tenTaiKhoan: string;

  @MaxLength(20, { groups: [CreateType.getGroups().createNew] })
  @Expose({ name: "mat_khau", groups: CreateType.getAllGroupsExcept("toAppRespone", "exposeAll") })
  matKhau: string;

  @Expose({ name: "anh_dai_dien", groups: CreateType.getAllGroups() })
  anhDaiDien: string;

  @IsEmpty({ groups: [CreateType.getGroups().update] })
  @Expose({ name: "loai_tk", groups: CreateType.getAllGroups() })
  loaiTK: string;
}