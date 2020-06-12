import { IQuery, FailResult, Result, SuccessResult, UseCaseError } from "@core";
import { DEPConsts, Dependency } from "@dep";
import { IPhieuRepository, ICTPhieuRepository } from "@modules/phieu/shared";
import { PhieuBanHang, ChiTietPhieuBHDTO, ChiTietPhieuBH } from "@modules/phieubanhang";
import { ISanPhamRepository } from "@modules/sanpham";
import Errors from "./ErrorConsts";
import GetPhieuBanHangByIdDTO from "./GetPhieuBanHangByIdDTO";

export default class GetPhieuBanHangById implements IQuery<GetPhieuBanHangByIdDTO> {
  
  private phieuBHRepo: IPhieuRepository<PhieuBanHang>;
  private ctphieuRepo: ICTPhieuRepository<ChiTietPhieuBH>;
  private sanphamRepo: ISanPhamRepository;

  constructor() {
    this.phieuBHRepo = Dependency.Instance.getRepository(DEPConsts.PhieuBHRepository);
    this.ctphieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuBHRepository);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }

  async execute(request: GetPhieuBanHangByIdDTO): Promise<Result<any, any>> {
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
    let listCTPhieuDTO = (await this.ctphieuRepo.findAllCTPhieu(phieuId)) as ChiTietPhieuBHDTO[];
    let listSanPham = await Promise.all(listCTPhieuDTO.map(ctphieu => this.sanphamRepo.getSanPhamById(ctphieu.sp_id, true)));
    return listSanPham.map((sanpham, index) => {
      let ctphieu = listCTPhieuDTO[index];
      return {
        ten_sp: sanpham.ten_sp,
        gia_ban: sanpham.gia_ban,
        ...ctphieu
      }
    })
  }

  validate(request: GetPhieuBanHangByIdDTO): Promise<Result<any, any>> {
    return;
  }

}