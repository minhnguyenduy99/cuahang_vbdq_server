import { IsString, Validate, IsEmpty } from "class-validator";
import CreateType from "../../../core/entity-create-type";
import { Expose } from "class-transformer";
import { IsQuantity, IsMoney } from "../../../helpers/custom-validator";

export default abstract class ChiTietPhieuProps {

  @IsString({ groups: CreateType.getAllGroupsExcept("createNew") })
  @Expose({ name: "phieu_id"})
  phieuId: string;

  @Validate(IsQuantity, { groups: CreateType.getAllGroups() })
  @Expose({ name: "so_luong" })
  soLuong: number;

  @Validate(IsMoney, { groups: CreateType.getAllGroupsExcept("createNew") })
  @IsEmpty({ groups: [CreateType.getGroups().createNew ]})
  @Expose({ name: "gia_tri" })
  giaTri: number;
}