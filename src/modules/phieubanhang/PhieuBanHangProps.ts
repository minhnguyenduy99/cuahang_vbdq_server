import { IsString, IsNotEmpty } from "class-validator";
import { CreateType } from "@modules/core";
import { PhieuProps } from "@modules/phieu/shared";
import { Expose } from "class-transformer";


export default class PhieuBanHangProps extends PhieuProps {

  @IsString({ groups: CreateType.getAllGroups()})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "kh_id" })
  khachHangId: string;
}