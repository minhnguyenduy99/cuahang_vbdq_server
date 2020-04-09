import { ICommand, Result, IDatabaseError, Entity, FailResult, SuccessResult } from "@core";
import { ISanPhamRepository, SanPhamDTO, SanPham } from "@modules/sanpham";
import SoLuongSanPhamKhongDu from "../../../ctphieubanhang/SoLuongKhongDu";
import CreateType from "@create_type";
import { ValidationError } from "class-validator";
import { ICTPhieuBHRepository, CTPhieuBanHang } from "@modules/ctphieubanhang";
import { SanPhamService, DomainService } from "@modules/services";

export interface TaoCTPhieuDTO {
  sp_id: string;
  so_luong: number;
}

type CTPhieuValidateError = IDatabaseError | ValidationError[] | ValidationError;

export class TaoCTPhieu implements ICommand<TaoCTPhieuDTO[]> {
  
  private commited: boolean;
  private data: CTPhieuBanHang[];
  private sanphamService: SanPhamService;

  constructor(
    private ctPhieuRepo: ICTPhieuBHRepository, 
    private sanphamRepo: ISanPhamRepository) {

    this.sanphamService = DomainService.getService(SanPhamService, this.sanphamRepo);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoCTPhieuDTO[]): Promise<Result<void, CTPhieuValidateError>> {
    const listCTPhieu = await this.createListCTPhieu(request);
    
    if (listCTPhieu.isFailure) {
      return FailResult.fail(listCTPhieu.error);
    }
    this.data = listCTPhieu.getValue();
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

  rollback(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getData(): CTPhieuBanHang[] {
    return this.data;
  }

  private async createCTPhieu(ctphieuDTO: TaoCTPhieuDTO) {
    let getSanPham = await this.sanphamService.findSanPhamById(ctphieuDTO.sp_id);
    if (getSanPham.isFailure) {
      return FailResult.fail(getSanPham.error);
    }
    return CTPhieuBanHang.create(ctphieuDTO, CreateType.getGroups().createNew, getSanPham.getValue());
  }

  private async createListCTPhieu(request: TaoCTPhieuDTO[]) {
    let createListCTPhieu = await Promise.all(request.map(ctphieuDTO => {
      return this.createCTPhieu(ctphieuDTO);
    }))
    
    return Result.combineSame(createListCTPhieu);
  }

  private async retrieveSanPham(listSanPhamId: string[]) {
    const getSanPham = await this.sanphamService.findSanPhamCollection(listSanPhamId);
    return getSanPham;
  }
}