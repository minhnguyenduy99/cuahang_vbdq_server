import { 
  TaiKhoanRepository, 
  NhaCungCapRepository, 
  NhanVienRepository,
  SanPhamRepository,
  KhachHangRepository,
  PhieuBHRepository,
  CTPhieuRepository, 
  RoleRepository } from "@services/db-access-manager/repos";

import { ImageLoader } from "@services/image-loader";
import { DatabaseService } from "@services/db-access-manager";
import { DomainAuthentication } from "@services/authenticate";
import { AuthorizationService } from "@services/authorization";

import {
  TaiKhoanService, 
  NhaCungCapService, 
  NhanVienService, 
  KhachHangService, 
  SanPhamService,
  CTPhieuBHService,
  PhieuBHService,
  AccountAuthenticateService } from "@modules/services/DomainService"

export default {
  // Repositories 
  TaiKhoanRepository,
  NhaCungCapRepository,
  NhanVienRepository,
  SanPhamRepository,
  KhachHangRepository,
  PhieuBHRepository,
  CTPhieuRepository,
  RoleRepository,

  // Domain services
  TaiKhoanService,
  NhaCungCapService,
  NhanVienService,
  KhachHangService,
  SanPhamService,
  CTPhieuBHService,
  PhieuBHService,
  AccountAuthenticateService,

  // Application services
  DatabaseService,
  ImageLoader,
  DomainAuthentication,
  AuthorizationService
}