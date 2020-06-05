import { FailResult, ICommand, SuccessResult, UseCaseError } from "@core";
import { ISanPhamRepository, SanPham, SanPhamDTO } from "@modules/sanpham";
import { INhaCungCapRepository, NhaCungCap } from "@modules/nhacungcap";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts"
import TaoSanPhamDTO from "./TaoSanPhamDTO";
import { ISanPhamService } from "../../shared";

export default class TaoSanPham implements ICommand<TaoSanPhamDTO> {
  
  private sanphamRepo: ISanPhamRepository;
  private nhacungcapRepo: INhaCungCapRepository;
  private sanphamService: ISanPhamService;
  private data: SanPham;
  private imageFile: any;
  private commited: boolean;

  constructor() {
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    this.nhacungcapRepo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
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
    this.imageFile = request.anh_dai_dien;
    request.anh_dai_dien = null;
    // Kiểm tra sản phẩm
    const createSanPhamResult = await SanPham.create(request, CreateType.getGroups().createNew, nhaCungCap.getValue()); 
    if (createSanPhamResult.isFailure) {
      return FailResult.fail(createSanPhamResult.error);
    }
    this.data = createSanPhamResult.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<SanPhamDTO> {
    await Promise.all([
      this.sanphamRepo.createSanPham(this.data),
      this.sanphamService.updateAnhSanPham(this.data, this.imageFile)
    ]);
    this.commited = true;
    return this.data.serialize();
  }
  
  rollback(): Promise<void> {
    return;
  }

  private async getNhaCungCap(idNhaCC: string = null) {
    const nhacungcapDTO = await this.nhacungcapRepo.getNhaCungCapById(idNhaCC);
    if (!nhacungcapDTO) {
      return FailResult.fail(new UseCaseError(Errors.NhaCungCapNotFound));
    }
    return NhaCungCap.create(nhacungcapDTO, CreateType.getGroups().loadFromPersistence);
  }
}