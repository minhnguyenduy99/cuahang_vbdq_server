import { ICommand, Result, IDatabaseError, Entity, FailResult, SuccessResult } from "@core";
import { ISanPhamRepository, SanPhamDTO, SanPham } from "@modules/sanpham";
import SoLuongSanPhamKhongDu from "./SoLuongKhongDu";
import CreateType from "@create_type";
import { ValidationError } from "class-validator";
import SanPhamKhongTonTai from "./SanPhamKhongTonTai";
import { ChiTietPhieu, ICTPhieuRepository, ChiTietPhieuDTO } from "@modules/phieu";
import { CTPhieuBHService, DomainService, SanPhamService } from "@modules/services/DomainService";

export interface TaoCTPhieuDTO {
  sp_id: string;
  so_luong: number;
}

type CTPhieuValidateError = IDatabaseError | ValidationError[] | ValidationError;

export class TaoCTPhieu implements ICommand<TaoCTPhieuDTO[]> {
  
  private commited: boolean;
  private data: ChiTietPhieu[];
  private ctphieuService: CTPhieuBHService;

  constructor(
    private ctPhieuRepo: ICTPhieuRepository<ChiTietPhieu>, 
    sanphamRepo: ISanPhamRepository) {

    this.ctphieuService = DomainService.getService(CTPhieuBHService, ctPhieuRepo, sanphamRepo);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoCTPhieuDTO[]) {
    const createListCTPhieu = await Promise.all(request.map(ctphieu => this.createCTPhieu(ctphieu)));
    const result = Result.combineSame(createListCTPhieu);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    this.data = result.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<Result<TaoCTPhieuDTO[], IDatabaseError>> {
    const commitResult = await this.ctPhieuRepo.createListCTPhieu(this.data);
    if (commitResult.isFailure) {
      return FailResult.fail(commitResult.error);
    }
    this.commited = true;
    return SuccessResult.ok(this.data.map(ctphieu => ctphieu.serialize(CreateType.getGroups().toAppRespone)));
  }
  
  getData(): ChiTietPhieu[] {
    return this.data;
  }

  private createCTPhieu(request: TaoCTPhieuDTO) {
    const ctphieuDTO = {
      sp_id: request.sp_id,
      so_luong: request.so_luong
    } as ChiTietPhieuDTO;
    return this.ctphieuService.createCTPhieu(ctphieuDTO)
  }
}