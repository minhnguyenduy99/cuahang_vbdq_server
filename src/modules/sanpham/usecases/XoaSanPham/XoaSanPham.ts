import { ICommand, FailResult, UseCaseError, SuccessResult } from "@core";
import { SanPham } from "../..";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";
import { ISanPhamRepository } from "../../shared";


export default class XoaSanPham implements ICommand<string> {
  private sanphamRepo: ISanPhamRepository;
  private commited: boolean = false;
  private data: SanPham;
  private deleteSanPhamId: string;

  constructor() {
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
  }
  
  isCommit(): boolean {
    return this.commited;
  }

  getData(): SanPham {
    return this.data;
  }

  async execute(sanphamId: string) {
    let sanpham = await this.sanphamRepo.getSanPhamById(sanphamId);
    if (!sanpham) {
      return FailResult.fail(new UseCaseError(Errors.SanPhamNotFound, { idsp: sanphamId }));
    }
    this.deleteSanPhamId = sanphamId;
    return SuccessResult.ok(null);
  }

  async commit(): Promise<any> {
    await Promise.all([
      this.sanphamRepo.deleteSanPham(this.deleteSanPhamId),
    ]);
    this.commited = true;
    return { sp_id: this.deleteSanPhamId };
  }
}