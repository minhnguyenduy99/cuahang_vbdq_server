import { ICommand, Result, IRepositoryError, Entity, FailResult, SuccessResult, DomainService } from "@core";
import { ISanPhamRepository, SanPhamDTO, SanPham } from "@modules/sanpham";
import SoLuongSanPhamKhongDu from "./SoLuongKhongDu";
import CreateType from "@create_type";
import { ValidationError } from "class-validator";
import SanPhamKhongTonTai from "./SanPhamKhongTonTai";
import { ChiTietPhieu, ICTPhieuRepository, ChiTietPhieuDTO } from "@modules/phieu";
import { CTPhieuBHService, SanPhamService } from "@modules/services/DomainService";
import { Dependency, DEPConsts } from "@dep";

export interface TaoCTPhieuDTO {
  sp_id: string;
  so_luong: number;
}

export class TaoCTPhieu implements ICommand<TaoCTPhieuDTO[]> {
  
  private commited: boolean;
  private data: ChiTietPhieu[];
  private ctphieuService: CTPhieuBHService;
  private ctPhieuRepo: ICTPhieuRepository<ChiTietPhieu>;

  constructor() {
    this.ctPhieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuRepository);
    this.ctphieuService = Dependency.Instance.getDomainService(DEPConsts.CTPhieuBHService);
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

  async commit(): Promise<Result<TaoCTPhieuDTO[], IRepositoryError>> {
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