import { ICommand, Result, FailResult, SuccessResult, UseCaseError } from "@core";
import { CreateType } from "@modules/core";
import { ICTPhieuRepository } from "@modules/phieu";
import { Dependency, DEPConsts } from "@dep";
import { ChiTietPhieuBH, ChiTietPhieuBHDTO } from "../..";
import { ISanPhamService } from "@modules/sanpham/shared";

import Errors from "./ErrorConsts";

export interface TaoCTPhieuDTO {
  sp_id: string;
  so_luong: number;
}

export class TaoCTPhieu implements ICommand<TaoCTPhieuDTO[]> {
  
  private commited: boolean;
  private data: ChiTietPhieuBH[];
  private ctPhieuRepo: ICTPhieuRepository<ChiTietPhieuBH>;
  private sanphamService: ISanPhamService;

  constructor() {
    this.ctPhieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuBHRepository);
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

  async commit(): Promise<ChiTietPhieuBHDTO[]> {
    await this.ctPhieuRepo.createListCTPhieu(this.data);
    this.commited = true;
    return this.data.map(ctphieu => ctphieu.serialize(CreateType.getGroups().toAppRespone));
  }
  
  getData(): ChiTietPhieuBH[] {
    return this.data;
  }

  private async createCTPhieu(request: TaoCTPhieuDTO) {
    let findSanPham = await this.sanphamService.findSanPhamById(request.sp_id);
    if (findSanPham.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamKhongTonTai, { sp_id: request.sp_id }));
    }
    let sanpham = findSanPham.getValue();
    if (sanpham.soLuong < request.so_luong) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamKhongDu, { sp_id: request.sp_id }));
    }
    return ChiTietPhieuBH.create(request, CreateType.getGroups().createNew, sanpham);
  }
}