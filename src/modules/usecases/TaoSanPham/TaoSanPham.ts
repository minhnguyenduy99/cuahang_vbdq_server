import { FailResult, ICommand, Result, IRepositoryError, SuccessResult } from "@core";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import { INhaCungCapRepository, NhaCungCap } from "@modules/nhacungcap";
import CreateType from "../../entity-create-type";
import NhaCungCapNotFound from "./NhaCungCapNotFound";
import { Dependency, DEPConsts } from "@dep";

export interface TaoSanPhamDTO {
  ten_sp: string;
  loai_sp: string;
  gia_nhap: number;
  gia_ban: number;
  khoi_luong: number;
  so_luong: number;
  nhacc_id: string;
  anh_dai_dien?: string;
  tieu_chuan?: string;
  ghi_chu?: string;
}

export class TaoSanPham implements ICommand<TaoSanPhamDTO> {
  
  private sanphamRepo: ISanPhamRepository;
  private nhacungcapRepo: INhaCungCapRepository;
  private data: SanPham;
  private commited: boolean;

  constructor() {
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    this.nhacungcapRepo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
    this.commited = false;
  }

  isCommit(): boolean {
    return this.commited;
  }

  getData(): SanPham {
    return this.data;
  }

  async execute(request: TaoSanPhamDTO) {
    // Tìm kiếm nhà cung cấp
    const nhaCungCap = await this.getNhaCungCap(request.nhacc_id);
    if (nhaCungCap.isFailure) {
      return FailResult.fail(nhaCungCap.error);
    }
    // Kiểm tra sản phẩm
    const createSanPhamResult = await SanPham.create(request, CreateType.getGroups().createNew, nhaCungCap.getValue()); 
    if (createSanPhamResult.isFailure) {
      return FailResult.fail(createSanPhamResult.error);
    }
    this.data = createSanPhamResult.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<Result<SanPhamDTO, IRepositoryError>> {
    const result = await this.sanphamRepo.createSanPham(this.data);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    return SuccessResult.ok(this.data.serialize());
  }
  
  rollback(): Promise<void> {
    return;
  }

  private async getNhaCungCap(idNhaCC: string = null) {
    const getNhaCungCap = await this.nhacungcapRepo.getNhaCungCapById(idNhaCC);
    if (getNhaCungCap.isFailure) {
      return FailResult.fail(getNhaCungCap.error);
    }
    if (!getNhaCungCap.getValue()) {
      return FailResult.fail(new NhaCungCapNotFound(idNhaCC));
    }
    return NhaCungCap.create(getNhaCungCap.getValue(), CreateType.getGroups().loadFromPersistence);
  }
}