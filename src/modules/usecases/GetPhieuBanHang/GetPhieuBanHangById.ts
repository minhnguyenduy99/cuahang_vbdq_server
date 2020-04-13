import { IQuery, FailResult, Result, SuccessResult, UseCaseError } from "@core";
import { IPhieuRepository, ICTPhieuRepository, ChiTietPhieu } from "@modules/phieu";
import { PhieuBanHang } from "@modules/phieu/phieubanhang";
import { ISanPhamRepository } from "@modules/sanpham";

export interface GetCTPhieuBanHangDTO {
  phieu_id: string;
}


export class GetPhieuBanHangById implements IQuery<GetCTPhieuBanHangDTO> {

  constructor(
    private phieuBHRepo: IPhieuRepository<PhieuBanHang>,
    private ctphieuRepo: ICTPhieuRepository<ChiTietPhieu>,
    private sanphamRepo: ISanPhamRepository
  ) {
  }

  async execute(request: GetCTPhieuBanHangDTO): Promise<Result<any, any>> {
    let [findPhieu, findCTPhieu] = await Promise.all([
      this.phieuBHRepo.findPhieuById(request.phieu_id),
      this.getCTPhieuDetail(request.phieu_id)
    ]);
    const result = Result.combine([findPhieu, findCTPhieu]);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    if (!findPhieu.getValue()) {
      return FailResult.fail(new UseCaseError(GetPhieuBanHangById, "Không tìm thấy phieu_id"));
    }
    let phieu = {
      ...findPhieu.getValue(),
      ds_ctphieu: findCTPhieu.getValue()
    }
    return SuccessResult.ok(phieu);
  }

  async getCTPhieuDetail(phieuId: string) {
    let findListCTPhieu = await this.ctphieuRepo.findAllCTPhieu(phieuId);
    let listCTPhieu = findListCTPhieu.getValue();
    if (findListCTPhieu.isFailure) {
      return FailResult.fail(findListCTPhieu.error);
    }
    if (listCTPhieu.length === 0) {
      return SuccessResult.ok([]);
    }

    let findListSanPham = await Promise.all(listCTPhieu.map(ctphieu => this.sanphamRepo.getSanPhamById(ctphieu.sp_id)));
    const result = Result.combineSame(findListSanPham);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    let listSanPham = result.getValue();
    return SuccessResult.ok(listCTPhieu.map((ctphieu, index) => {
      const { ten_sp, gia_ban } = listSanPham[index];
      return {
        ...ctphieu,
        ten_sp,
        gia_ban
      }
    }));
  }

  validate(request: GetCTPhieuBanHangDTO): Promise<Result<any, any>> {
    return;
  }

}