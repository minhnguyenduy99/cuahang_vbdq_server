import { IsString, IsNotEmpty } from "class-validator";
import CreateType from "../../entity-create-type";
import { PhieuProps, PhieuDTO } from "../PhieuProps";
import { Expose } from "class-transformer";

export interface PhieuBanHangDTO extends PhieuDTO {
  kh_id: string;
}

export class PhieuBanHangProps extends PhieuProps {

  @IsString({ groups: CreateType.getAllGroups()})
  @IsNotEmpty({ groups: CreateType.getAllGroups() })
  @Expose({ name: "kh_id" })
  khachHangId: string;
}