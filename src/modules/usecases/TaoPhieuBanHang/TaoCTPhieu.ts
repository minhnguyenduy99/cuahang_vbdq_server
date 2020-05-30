import { ICommand, Result, FailResult, SuccessResult, InvalidDataError, UseCaseError } from "@core";
import CreateType from "@create_type";
import { ChiTietPhieu, ICTPhieuRepository, ChiTietPhieuDTO } from "@modules/phieu";
import { CTPhieuBHService } from "@modules/services/DomainService";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { ISanPhamRepository } from "@modules/sanpham";
import { ISanPhamService } from "@modules/services/Shared";

export interface TaoCTPhieuDTO {
  sp_id: string;
  so_luong: number;
}

export class TaoCTPhieu implements ICommand<TaoCTPhieuDTO[]> {
  
  private commited: boolean;
  private data: ChiTietPhieu[];
  private ctPhieuRepo: ICTPhieuRepository<ChiTietPhieu>;
  private sanphamService: ISanPhamService;

  constructor() {
    this.ctPhieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuRepository);
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoCTPhieuDTO[]) {
    const createListCTPhieu = await Promise.all(request.map(ctphieu => this.createCTPhieu(ctphieu)));
    const result = Result.combine(createListCTPhieu);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    this.data = result.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<TaoCTPhieuDTO[]> {
    await this.ctPhieuRepo.createListCTPhieu(this.data);
    this.commited = true;
    return this.data.map(ctphieu => ctphieu.serialize(CreateType.getGroups().toAppRespone));
  }
  
  getData(): ChiTietPhieu[] {
    return this.data;
  }

  private async createCTPhieu(request: TaoCTPhieuDTO) {
    const ctphieuDTO = {
      sp_id: request.sp_id,
      so_luong: request.so_luong
    } as ChiTietPhieuDTO;
    let findSanPham = await this.sanphamService.findSanPhamById(ctphieuDTO.sp_id);
    if (findSanPham.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamKhongTonTai, { sp_id: ctphieuDTO.sp_id }));
    }
    let sanpham = findSanPham.getValue();
    if (sanpham.soLuong < ctphieuDTO.so_luong) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamKhongDu, { sp_id: ctphieuDTO.sp_id }));
    }
    return ChiTietPhieu.create(ctphieuDTO, CreateType.getGroups().createNew, sanpham);
  }
}