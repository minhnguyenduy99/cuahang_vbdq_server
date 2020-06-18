import { ImageLoader } from "@services/image-loader";
import { DatabaseService } from "@services/db-access-manager";
import { AuthorizationService } from "@services/authorization";
import { Tokenizer } from "@services/tokenizer";

import { TaiKhoanRepository, TaiKhoanService, AccountAuthenticateService } from "@modules/taikhoan";
import { LoaiTaiKhoanRepository } from "@modules/loaitaikhoan";
import { KhachHangRepository, KhachHangService } from "@modules/khachhang";
import { NhaCungCapRepository, NhaCungCapService } from "@modules/nhacungcap";
import { NhanVienRepository, NhanVienService } from "@modules/nhanvien";
import { SanPhamRepository, SanPhamService } from "@modules/sanpham";
import { PhieuBHRepository, CTPhieuBHRepository } from "@modules/phieubanhang";
import { PhieuNhapKhoRepository, CTPhieuNKRepository } from "@modules/phieunhapkho";
import { RoleService } from "@modules/roles";

export default {

  // repos
  TaiKhoanRepository,
  KhachHangRepository,
  LoaiTaiKhoanRepository,
  NhaCungCapRepository,
  NhanVienRepository,
  SanPhamRepository,
  PhieuBHRepository,
  CTPhieuBHRepository,
  PhieuNhapKhoRepository, 
  CTPhieuNKRepository,

  // domain services
  TaiKhoanService,
  AccountAuthenticateService,
  NhanVienService,
  SanPhamService,
  KhachHangService,
  NhaCungCapService,
  RoleService,

  // external services
  ImageLoader,
  DatabaseService,
  AuthorizationService,
  Tokenizer
}