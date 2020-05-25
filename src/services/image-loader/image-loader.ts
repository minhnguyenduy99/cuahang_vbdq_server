import cloudinary from "cloudinary";
import { IAppSettings, ApplicationService } from "@core";

const cloudinary_v2 = cloudinary.v2;

interface SettingsData {
  url?: string;
  name?: string;
  apiKey?: string;
  apiSecret?: string
}

const ALLOW_IMAGE_EXT = ['jpg', 'jpeg', 'png'];

export const FOLDERS = {
  NhanVien: "NHANVIEN",
  KhachHang: "KHACHHANG",
  SanPham: "SANPHAM",
  NhaCungCap: "NHACUNGCAP"
}

export class ImageLoader extends ApplicationService<SettingsData> {
  
  constructor(appSettings: IAppSettings) {
    super(appSettings);
    this.config();
  }

  protected getAppSettings(settings: IAppSettings): SettingsData {
    return settings.getValue("remoteImageServer") as SettingsData;
  }

  async upload(file: any, folder: string) {
    try {
      let parts = file ? file.name.split('.') : [""]
      let ext = parts[parts.length - 1]
      if (!ALLOW_IMAGE_EXT.includes(ext)) {
        return this.loadDefaultImage(folder);
      }
      const result = await cloudinary_v2.uploader.upload(file.path, { folder: folder });
      return result.url;
    } catch (err) {
      console.log(err);
      return this.loadDefaultImage(folder);
    }
  }

  private loadDefaultImage(folder: string) {
    switch(folder) {
      case FOLDERS.KhachHang: return "https://res.cloudinary.com/cuahangvbdq-dev/image/upload/v1590415654/KHACHHANG/customer_default.jpg";
      case FOLDERS.NhanVien: return "https://res.cloudinary.com/cuahangvbdq-dev/image/upload/v1590416416/NHANVIEN/staff_default.jpg";
      case FOLDERS.SanPham: return "https://res.cloudinary.com/cuahangvbdq-dev/image/upload/v1590416630/SANPHAM/product_default.jpg";
      case FOLDERS.NhaCungCap: return "https://res.cloudinary.com/cuahangvbdq-dev/image/upload/v1590416705/NHACUNGCAP/provider_default.png";
      default: return null;
    }
  }

  private config() {
    const { apiKey, apiSecret, name } = this.serviceData;
    cloudinary_v2.config({
      cloud_name: name, 
      api_key: apiKey, 
      api_secret: apiSecret
    })
  }
}
