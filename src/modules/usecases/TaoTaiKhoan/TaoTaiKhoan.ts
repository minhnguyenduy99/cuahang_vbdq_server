import { NhanVien, INhanVienRepository } from "@modules/nhanvien";
import { CreateTaiKhoan } from "@usecases/CreateTaiKhoan";
import { FailResult, SuccessResult, ICommand, DomainEvents, UseCaseError } from "@core";
import CreateType from "@create_type";
import { Dependency, DEPConsts } from "@dep";
import Errors from "./ErrorConsts";

export interface TaoTaiKhoanDTO {

  idql?: string;
  chucvu: string;
  ho_ten: string;
  cmnd: string;
  ngay_sinh: Date;
  gioi_tinh: string;
  sdt: string;
  dia_chi?: string;
  ghi_chu?: string;
  ten_tk: string;
  mat_khau: string;
  anh_dai_dien: string;
  loai_tk: number;
}


export class TaoTaiKhoan implements ICommand<TaoTaiKhoanDTO> {
  
  private taoTaiKhoanUseCase: CreateTaiKhoan; 
  private nhanvienRepo: INhanVienRepository
  private data: NhanVien;
  private commited: boolean;

  constructor() {
    this.nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
    this.commited = false;
    this.taoTaiKhoanUseCase = new CreateTaiKhoan();
  }

  getData(): NhanVien {
    return this.data;
  }

  isCommit() {
    return this.commited;
  }
  
  async execute(request: TaoTaiKhoanDTO) {
    // Thực hiện use case thêm tài khoản 
    const saveTaiKhoan = await this.taoTaiKhoanUseCase.execute({ 
      ten_tk: request.ten_tk,
      mat_khau: request.mat_khau,
      anh_dai_dien: request.anh_dai_dien,
      loai_tk: request.loai_tk
    });
    if (saveTaiKhoan.isFailure) {
      return FailResult.fail(saveTaiKhoan.error);
    }
    const isNhanVienExists = await this.isNhanVienExists(request.cmnd);
    if (isNhanVienExists) {
      return FailResult.fail(new UseCaseError(Errors.NhanVienTonTai));
    }
    const taikhoan = this.taoTaiKhoanUseCase.getData();
    let createNVResult = await NhanVien.create({ ...request, tk_id: taikhoan.id }, CreateType.getGroups().createNew,  this.taoTaiKhoanUseCase.getData());
    if (createNVResult.isFailure) {
      return FailResult.fail(createNVResult.error);
    }

    this.data = createNVResult.getValue();
    return SuccessResult.ok(null);
  }

  async commit() {
    try {
      await Promise.all([
        this.taoTaiKhoanUseCase.commit(),
        this.nhanvienRepo.createNhanVien(this.data)
      ])
    } catch (err) {
      this.taoTaiKhoanUseCase.rollback();
      throw err;
    }
    let serializedData = this.data.serialize(CreateType.getGroups().toAppRespone); 
    // dispatch the domain event
    DomainEvents.dispatchEventsForAggregate(this.data.entityId);

    return serializedData;
  }

  async rollback() {
    if (this.taoTaiKhoanUseCase.isCommit()) {
      this.taoTaiKhoanUseCase.rollback();
    }
  }

  private async isNhanVienExists(cmnd: string) {
    const nhanvienDTO = await this.nhanvienRepo.getNhanVienByCMND(cmnd);
    return nhanvienDTO !== null;
  }
}