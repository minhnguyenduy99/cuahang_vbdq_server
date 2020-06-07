import { FailResult, SuccessResult, EntityNotFound, InvalidEntity } from "@core";
import { TaiKhoan, ITaiKhoanRepository } from "@modules/taikhoan";
import { CreateType } from "@modules/core";
import { Dependency, DEPConsts } from "@dep";
import ITaiKhoanService from "./shared/ITaiKhoanService";
import { IImageLoader, FOLDERS } from "@services/image-loader";

export default class TaiKhoanService implements ITaiKhoanService {
  
  private repo: ITaiKhoanRepository;
  private imageLoader: IImageLoader;

  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.TaiKhoanRepository);  
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
  }

  async updateTaiKhoan(taiKhoan: TaiKhoan, data: any) {
    if (!taiKhoan) {
      return FailResult.fail(new InvalidEntity("TaiKhoan", "TaiKhoan"));
    }
    let update = await taiKhoan.update(data);
    if (update.isFailure || (update.isSuccess && !data.anh_dai_dien)) {
      return update;
    }
    let result = await this.updateAnhDaiDien(taiKhoan, data.anh_dai_dien);
    if (result.isFailure) {
      return result;
    }
    return update;
  }

  async findTaiKhoanById(taikhoanId: string) {
    const taikhoanDTO = await this.repo.findTaiKhoanById(taikhoanId);
    if (!taikhoanDTO) {
      return FailResult.fail(new EntityNotFound(TaiKhoan));
    }
    const taikhoan = await TaiKhoan.create(taikhoanDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(taikhoan.getValue());
  }

  async findTaiKhoanByTenDangNhap(tenDangNhap: string) {
    const taikhoanDTO = await this.repo.findTaiKhoan(tenDangNhap);
    if (!taikhoanDTO) {
      return FailResult.fail(new EntityNotFound(TaiKhoan));
    }
    const taikhoan = await TaiKhoan.create(taikhoanDTO, CreateType.getGroups().loadFromPersistence);
    return SuccessResult.ok(taikhoan.getValue());
  }

  async updateAnhDaiDien(taikhoanParam: string | TaiKhoan, imageFile: any | "usedefault") {
    let taiKhoan: TaiKhoan;
    if (taikhoanParam instanceof String) {
      const findTaikhoan = await this.findTaiKhoanById(taikhoanParam as string);
      if (findTaikhoan.isFailure) {
        return FailResult.fail(findTaikhoan.error);
      }
      taiKhoan = findTaikhoan.getValue(); 
    } else {
      taiKhoan = taikhoanParam as TaiKhoan;
    }
    if (imageFile !== "usedefault") {
      let isImageAllowed = this.imageLoader.isFileAllowed(imageFile);
      if (!isImageAllowed) {
        return FailResult.fail(new Error("Hình ảnh không hợp lệ"));
      }
    }
    let folder = taiKhoan.loaiTaiKhoan === "0" ? FOLDERS.KhachHang : FOLDERS.NhanVien;
    let url = await this.imageLoader.upload(imageFile, folder);
    taiKhoan.updateAnhDaiDien(url);
    return SuccessResult.ok(null);
  }
  
  persist(taikhoan: TaiKhoan): Promise<any> {
    return this.repo.updateTaiKhoan(taikhoan);
  }
}