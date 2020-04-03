import uniqid from "uniqid";
import { NhanVien, NhanVienDTO } from "../../NhanVien";
import { ITaiKhoanRepository, CreateTaiKhoan, CreateTaiKhoanDTO, TaiKhoanDTO } from "@modules/taikhoan";
import { IUseCase, FailResult, SuccessResult, ICommand } from "@core";
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
  tai_khoan: CreateTaiKhoanDTO;
}


export class TaoTaiKhoan implements ICommand<TaoTaiKhoanDTO> {
  
  private taikhoanRepo: ITaiKhoanRepository;
  private nhanvienRepo: INhanVienRepository;
  private taoTaiKhoanUseCase: CreateTaiKhoan;
  private data: NhanVien;
  private commited: boolean;

  constructor(taikhoanRepo: ITaiKhoanRepository, nhanvienRepo: INhanVienRepository) {
    this.taikhoanRepo = taikhoanRepo;
    this.nhanvienRepo = nhanvienRepo;
    this.commited = false;
    this.taoTaiKhoanUseCase = new CreateTaiKhoan(this.taikhoanRepo);
  }

  getData() {
    return this.data;
  }

  isCommit() {
    return this.commited;
  }
  
  async execute(request: TaoTaiKhoanDTO) {
    // Thực hiện use case thêm tài khoản 
    const saveTaiKhoan = await this.taoTaiKhoanUseCase.execute(request.tai_khoan);
    if (saveTaiKhoan.isFailure) {
      return FailResult.fail(saveTaiKhoan.error);
    }
    let createNVResult = await NhanVien.create(request, this.taoTaiKhoanUseCase.getData(), CreateType.getGroups().createNew);
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
      return FailResult.fail(saveNhanVien.error);
    }
    let serializedData = this.data.serialize();
    serializedData.tai_khoan = this.taoTaiKhoanUseCase.getData().serialize();
    return SuccessResult.ok(serializedData);
  }

  async rollback() {
    if (this.taoTaiKhoanUseCase.isCommit()) {
      this.taoTaiKhoanUseCase.rollback();
    }
  }
}