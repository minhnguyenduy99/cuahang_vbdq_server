import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import UpdateSanPhamDTO from "./UpdateSanPhamDTO";
import { ISanPhamService, SanPham } from "../..";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { ISanPhamRepository, SanPhamDTO } from "../../shared";


export default class UpdateSanPham implements ICommand<UpdateSanPhamDTO> {
  private sanphamService: ISanPhamService;
  private sanphamRepo: ISanPhamRepository;
  private commited: boolean = false;
  private data: SanPham;
  private oldSanPhamId: string;

  constructor() {
    this.sanphamService = Dependency.Instance.getDomainService(DEPConsts.SanPhamService);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  getData(): SanPham {
    return this.data;
  }

  async execute(request: UpdateSanPhamDTO) {
    let findSanPham = await this.sanphamService.findSanPhamById(request.idsp);
    if (findSanPham.isFailure) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamNotFound, { idsp: request.idsp }));
    }
    let result = await this.sanphamService.updateSanPhamInfo(findSanPham.getValue(), request);
    if (result.isFailure) {
      return FailResult.fail(result.error);
    }
    this.oldSanPhamId = findSanPham.getValue().getId();
    this.data = result.getValue();
    return SuccessResult.ok(null);
  }

  async commit(): Promise<SanPhamDTO> {
    await Promise.all([
      this.sanphamRepo.deleteSanPham(this.oldSanPhamId),
      this.sanphamRepo.createSanPham(this.data)
    ]);
    this.commited = true;
    return this.data.serialize();
  }
}