import { ICommand, Result, FailResult, SuccessResult, UseCaseError } from "@core";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { ISanPhamService } from "@modules/sanpham/shared";
import { ChiTietPhieuNhapKho, ChiTietPhieuNhapKhoDTO, ICTPhieuNhapKhoRepository } from "../../.";
import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import Errors from "./ErrorConsts";
import TaoCTPhieuNKDTO from "./TaoCTPhieuNKDTO";


export default class TaoCTPhieuNK implements ICommand<TaoCTPhieuNKDTO[]> {
  
  private commited: boolean;
  private data: ChiTietPhieuNhapKho[];
  private ctPhieuRepo: ICTPhieuNhapKhoRepository;
  private sanphamService: ISanPhamService;
  private sanphamRepo: ISanPhamRepository;

  constructor() {
    this.ctPhieuRepo = Dependency.Instance.getRepository(DEPConsts.CTPhieuNKRepository);
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  async execute(request: TaoCTPhieuNKDTO[]) {
    const createListCTPhieu = await Promise.all(request.map(ctphieu => this.createCTPhieu(ctphieu)));
    const result = Result.combine(createListCTPhieu);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    this.data = result.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<ChiTietPhieuNhapKhoDTO[]> {
    await this.ctPhieuRepo.createListCTPhieu(this.data);
    this.commited = true;
    return this.data.map(ctphieu => ctphieu.serialize(CreateType.getGroups().toAppRespone));
  }
  
  getData(): ChiTietPhieuNhapKho[] {
    return this.data;
  }

  private async createCTPhieu(request: TaoCTPhieuNKDTO) {
    let sanphamDTO = await this.sanphamRepo.getSanPhamById(request.sp_id);
    if (!sanphamDTO) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamKhongTonTai, { sp_id: request.sp_id }));
    }
    if (sanphamDTO.nhacc_id !== request.nhacc_id) {
      return FailResult.fail(new UseCaseError(Errors.NhaCungCapKhongKhop, { sp_id: request.sp_id }));
    }
    let sanpham = await SanPham.create(sanphamDTO, CreateType.getGroups().loadFromPersistence);
    return ChiTietPhieuNhapKho.create(request, CreateType.getGroups().createNew, sanpham.getValue());
  }
}