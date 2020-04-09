import uniqid from "uniqid";
import { NhanVien, NhanVienDTO } from "../../NhanVien";
import { ITaiKhoanRepository, CreateTaiKhoan } from "@modules/taikhoan";
import { IUseCase, FailResult, SuccessResult, ICommand, DomainEvents } from "@core";
import { INhanVienRepository } from "../..";
import CreateType from "../../../entity-create-type";

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
  private data: NhanVien;
  private commited: boolean;

  constructor(
    private taikhoanRepo: ITaiKhoanRepository, 
    private nhanvienRepo: INhanVienRepository) {
    this.taikhoanRepo = taikhoanRepo;
    this.nhanvienRepo = nhanvienRepo;
    this.commited = false;
    this.taoTaiKhoanUseCase = new CreateTaiKhoan(this.taikhoanRepo);
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
    const taikhoan = this.taoTaiKhoanUseCase.getData();
    let createNVResult = await NhanVien.create({ ...request, tk_id: taikhoan.id }, CreateType.getGroups().createNew,  this.taoTaiKhoanUseCase.getData());
    if (createNVResult.isFailure) {
      return FailResult.fail(createNVResult.error);
    }

    this.data = createNVResult.getValue();
    return SuccessResult.ok(null);
  }

  async commit() {
    const saveTaiKhoan = await this.taoTaiKhoanUseCase.commit();
    if (saveTaiKhoan.isFailure) {
      return FailResult.fail(saveTaiKhoan.error);
    }
    const saveNhanVien = await this.nhanvienRepo.createNhanVien(this.data);
    if (saveNhanVien.isFailure) {
      this.taoTaiKhoanUseCase.rollback();
      return FailResult.fail(saveNhanVien.error);
    }
    let serializedData = this.data.serialize(CreateType.getGroups().toAppRespone);
    
    // dispatch the domain event
    DomainEvents.dispatchEventsForAggregate(this.data.entityId);

    return SuccessResult.ok(serializedData);
  }

  async rollback() {
    if (this.taoTaiKhoanUseCase.isCommit()) {
      this.taoTaiKhoanUseCase.rollback();
    }
  }
}