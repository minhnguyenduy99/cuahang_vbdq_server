import { IQuery, FailResult, Result, SuccessResult, UseCaseError } from "@core";
import { DEPConsts, Dependency } from "@dep";
import { IPhieuRepository, ICTPhieuRepository } from "@modules/phieu/shared";
import { PhieuNhapKho, ChiTietPhieuNhapKhoDTO, ChiTietPhieuNhapKho } from "../../";
import { ISanPhamRepository } from "@modules/sanpham";
import Errors from "./ErrorConsts";
import GetPhieuNhapKhoByIdDTO from "./GetPhieuNhapKhoByIdDTO";

export default class GetPhieuNhapKhoById implements IQuery<GetPhieuNhapKhoByIdDTO> {
  
  private phieuNKRepo: IPhieuRepository<PhieuNhapKho>;
  private ctphieuRepo: ICTPhieuRepository<ChiTietPhieuNhapKho>;
  private sanphamRepo: ISanPhamRepository;

  constructor() {
    this.phieuNKRepo = Dependency.Instance.getRepository(DEPConsts.PhieuNhapKhoRepository);
    this.ctphieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuNKRepository);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }

  async execute(request: GetPhieuNhapKhoByIdDTO): Promise<Result<any, any>> {
    let [phieuDTO, listCTPhieuDetails] = await Promise.all([
      this.phieuNKRepo.findPhieuById(request.phieu_id),
      this.getCTPhieuDetail(request.phieu_id)
    ]);
    if (!phieuDTO) {
      return FailResult.fail(new UseCaseError(Errors.PhieuNhapKhoNotFound));
    }
    let phieu = {
      ...phieuDTO,
      ds_ctphieu: listCTPhieuDetails
    }
    return SuccessResult.ok(phieu);
  }

  async getCTPhieuDetail(phieuId: string) {
    let listCTPhieuDTO = (await this.ctphieuRepo.findAllCTPhieu(phieuId)) as ChiTietPhieuNhapKhoDTO[];
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

  validate(request: GetPhieuNhapKhoByIdDTO): Promise<Result<any, any>> {
    return;
  }

}