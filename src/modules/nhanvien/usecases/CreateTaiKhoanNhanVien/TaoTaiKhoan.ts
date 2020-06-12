import { NhanVien, INhanVienRepository } from "@modules/nhanvien";
import { CreateTaiKhoan } from "@modules/taikhoan/usecases/CreateTaiKhoan";
import { FailResult, SuccessResult, ICommand, DomainEvents, UseCaseError } from "@core";
import { ILoaiTaiKhoanRepository } from "@modules/loaitaikhoan";
import { Dependency, DEPConsts } from "@dep";
import { CreateType } from "@modules/core";
import Errors from "./ErrorConsts";
import TaoTaiKhoanDTO from "./TaoTaiKhoanDTO";


export default class TaoTaiKhoan implements ICommand<TaoTaiKhoanDTO> {
  
  private taoTaiKhoanUseCase: CreateTaiKhoan; 
  private nhanvienRepo: INhanVienRepository;
  private loaiTKRepo: ILoaiTaiKhoanRepository;
  private data: NhanVien;
  private commited: boolean;

  constructor() {
    this.nhanvienRepo = Dependency.Instance.getRepository(DEPConsts.NhanVienRepository);
    this.loaiTKRepo = Dependency.Instance.getRepository(DEPConsts.LoaiTaiKhoanRepository);
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
    // Kiểm tra loại tài khoản có hợp lệ
    let listLoaiTKNhanVien = await this.loaiTKRepo.findLoaiTKNhanVien();
    if (listLoaiTKNhanVien.filter(loaiTK => loaiTK.ma_ltk === request.loai_tk).length === 0) {
      return FailResult.fail(new UseCaseError(Errors.LoaiTaiKhoanInvalid, { loai_tk: request.loai_tk }));
    }
    // Thực hiện use case thêm tài khoản 
    const taoTaiKhoan = await this.taoTaiKhoanUseCase.execute({ 
      ten_tk: request.ten_tk,
      mat_khau: request.mat_khau,
      anh_dai_dien: request.anh_dai_dien,
      loai_tk: request.loai_tk
    });
    if (taoTaiKhoan.isFailure) {
      return FailResult.fail(taoTaiKhoan.error);
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
      let [taikhoanData] = await Promise.all([
        this.taoTaiKhoanUseCase.commit(),
        this.nhanvienRepo.createNhanVien(this.data)
      ])

      let serializedData = this.data.serialize(CreateType.getGroups().toAppRespone); 
      // dispatch the domain event
      DomainEvents.dispatchEventsForAggregate(this.data.entityId);
      return {
        ...serializedData,
        tai_khoan: taikhoanData
      }
    } catch (err) {
      this.taoTaiKhoanUseCase.rollback();
      throw err;
    }
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