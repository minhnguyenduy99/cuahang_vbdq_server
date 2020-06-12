import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { SanPham } from "../..";
import { ISanPhamService } from "../../shared";
import { Dependency, DEPConsts } from "@dep";
import UpdateAnhSanPhamDTO from "./UpdateAnhSanPhamDTO";
import Errors from "./ErrorConsts";


export default class UpdateAnhSanPham implements ICommand<UpdateAnhSanPhamDTO> {
  
  private commited: boolean = false;
  private data: SanPham;
  private imageFile: any;
  private sanphamService: ISanPhamService;

  constructor() {
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
  }

  isCommit(): boolean {
    return this.commited;
  }

  getData(): SanPham {
    return this.data;
  }

  async execute(request: UpdateAnhSanPhamDTO) {
    if (!request || !request.imageFile) {
      return FailResult.fail(new UseCaseError(Errors.AnhKhongHopLe));
    }
    let getSanPham = await this.sanphamService.findSanPhamById(request.idsp);
    if (getSanPham.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamNotFound, { sp_id: request.idsp }));
    }
    let updateSuccess = await this.sanphamService.updateAnhSanPham(getSanPham.getValue(), request.imageFile);
    if (!updateSuccess) {
      return FailResult.fail(new UseCaseError(Errors.AnhKhongHopLe));
    }
    this.data = getSanPham.getValue();
    this.imageFile = request.imageFile;
    return SuccessResult.ok(null);
  }
  
  async commit(): Promise<any> {
    this.commited = true;
    return {
      url: this.data.anhDaiDien
    }
  }
}