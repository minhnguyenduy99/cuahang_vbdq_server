import { FailResult, SuccessResult, ICommand, DomainEvents } from "@core";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import { KhachHang, IKhachHangRepository } from "@modules/khachhang";
import { ILoaiTaiKhoanRepository } from "@modules/loaitaikhoan";
import { CreateTaiKhoan } from "@modules/taikhoan/usecases/CreateTaiKhoan";
import TaoTaiKhoanKHDTO from "./TaoTaiKhoanKHDTO";

export default class TaoTaiKhoanKhachHang implements ICommand<TaoTaiKhoanKHDTO> {
  
  private taoTaiKhoanUseCase: CreateTaiKhoan; 
  private khachhangRepo: IKhachHangRepository;
  private loaiTKRepo: ILoaiTaiKhoanRepository;
  private data: KhachHang;
  private commited: boolean;

  constructor() {
    this.khachhangRepo = Dependency.Instance.getRepository(DEPConsts.KhachHangRepository);
    this.loaiTKRepo = Dependency.Instance.getRepository(DEPConsts.LoaiTaiKhoanRepository);
    this.commited = false;
    this.taoTaiKhoanUseCase = new CreateTaiKhoan();
  }

  getData(): KhachHang {
    return this.data;
  }

  isCommit() {
    return this.commited;
  }
  
  async execute(request: TaoTaiKhoanKHDTO) {
    let loaiTKKhachHang = await this.loaiTKRepo.findLoaiTKKhachHang();
    // Thực hiện use case thêm tài khoản 
    const saveTaiKhoan = await this.taoTaiKhoanUseCase.execute({ 
      ten_tk: request.ten_tk,
      mat_khau: request.mat_khau,
      anh_dai_dien: request.anh_dai_dien,
      loai_tk: loaiTKKhachHang.ma_ltk
    });
    if (saveTaiKhoan.isFailure) {
      return FailResult.fail(saveTaiKhoan.error);
    }
    const taikhoan = this.taoTaiKhoanUseCase.getData();
    let createNVResult = await KhachHang.create({ ...request, tk_id: taikhoan.id }, CreateType.getGroups().createNew);
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
        this.khachhangRepo.createKhachHang(this.data)
      ])
      let serializedData = {
        ...this.data.serialize(CreateType.getGroups().toAppRespone),
        tai_khoan: taikhoanData
      }
      // dispatch the domain event
      DomainEvents.dispatchEventsForAggregate(this.data.entityId);
      return serializedData;
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

  private async isKhachHangExists(cmnd: string) {
    const khachhangDTO = await this.khachhangRepo.findKhachHangByCMND(cmnd);
    return khachhangDTO !== null;
  }
}