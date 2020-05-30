import { IQuery, FailResult, Result, SuccessResult, UseCaseError } from "@core";
import { IPhieuRepository, ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
import { ISanPhamRepository } from "@modules/sanpham";
import { DEPConsts, Dependency } from "@dep";
import Errors from "./ErrorConsts";

export interface GetCTPhieuBanHangDTO {
  phieu_id: string;
}


export class GetPhieuBanHangById implements IQuery<GetCTPhieuBanHangDTO> {
  
  private phieuBHRepo: IPhieuRepository<PhieuBanHang>;
  private ctphieuRepo: ICTPhieuRepository<ChiTietPhieu>;
  private sanphamRepo: ISanPhamRepository;

  constructor() {
    this.phieuBHRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
    this.ctphieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuRepository);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }

  async execute(request: GetCTPhieuBanHangDTO): Promise<Result<any, any>> {
    let [phieuDTO, listCTPhieuDetails] = await Promise.all([
      this.phieuBHRepo.findPhieuById(request.phieu_id),
      this.getCTPhieuDetail(request.phieu_id)
    ]);
    if (!phieuDTO) {
      return FailResult.fail(new UseCaseError(Errors.PhieuBanHangNotFound));
    }
    let phieu = {
      ...phieuDTO,
      ds_ctphieu: listCTPhieuDetails
    }
    return SuccessResult.ok(phieu);
  }

  async getCTPhieuDetail(phieuId: string) {
    let listCTPhieuDTO = await this.ctphieuRepo.findAllCTPhieu(phieuId);
    let listSanPham = await Promise.all(listCTPhieuDTO.map(ctphieu => this.sanphamRepo.getSanPhamById(ctphieu.sp_id)));
    return listSanPham.map((sanpham, index) => {
      let ctphieu = listCTPhieuDTO[index];
      return {
        ten_sp: sanpham.ten_sp,
        gia_ban: sanpham.gia_ban,
        ...ctphieu
      }
    })
  }

  validate(request: GetCTPhieuBanHangDTO): Promise<Result<any, any>> {
    return;
  }

}