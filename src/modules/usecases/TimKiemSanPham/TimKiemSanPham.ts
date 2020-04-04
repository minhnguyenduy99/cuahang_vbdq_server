import { IQuery, IDatabaseError, Result, FailResult, SuccessResult } from "@core";
import { ISanPhamRepository, SanPhamDTO } from "@modules/sanpham";
import { INhaCungCapRepository } from "@modules/nhacungcap";
import { ValidationError } from "class-validator";
export interface TimKiemSanPhamDTO {
  ten_sp?: string;
  loai_sp?: string;
  from: number;
  so_luong: number;
}

export class TimKiemSanPham implements IQuery<TimKiemSanPhamDTO> {
  
  private sanphamRepo: ISanPhamRepository;
  private nhaCCRepo: INhaCungCapRepository;

  constructor(sanphamRepo: ISanPhamRepository, nhaCCRepo: INhaCungCapRepository) {
    this.sanphamRepo = sanphamRepo;
    this.nhaCCRepo = nhaCCRepo;
  }
  
  async execute(request: TimKiemSanPhamDTO): Promise<Result<SanPhamDTO[], IDatabaseError | ValidationError>> {
    const validateRequest = this.validateRequest(request);
    if (validateRequest.isFailure) {
      return FailResult.fail(validateRequest.error);
    }
    const { ten_sp, so_luong, loai_sp, from } = validateRequest.getValue();
    const searchSanPham = await this.sanphamRepo.searchSanPham(ten_sp, loai_sp, { from: from, count: so_luong });
    return searchSanPham;
  }

  private validateRequest(request: TimKiemSanPhamDTO) {
    if (!request || request.from < 0 || request.so_luong <= 0) {
      return FailResult.fail(new ValidationError());
    }
    return SuccessResult.ok(request);
  }

}