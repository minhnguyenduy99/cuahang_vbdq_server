import { FailResult, SuccessResult, EntityNotFound } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { CreateType } from "@modules/core";
import { NhaCungCap, INhaCungCapRepository } from "@modules/nhacungcap";
import { INhaCungCapService } from "./shared";
import { ISanPhamRepository, SanPham } from "@modules/sanpham";
import { IImageLoader, FOLDERS } from "@services/image-loader";

export default class NhaCungCapService implements INhaCungCapService {
  
  private repo: INhaCungCapRepository;
  private sanphamRepo: ISanPhamRepository;
  private imageLoader: IImageLoader;
  
  
  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
    this.imageLoader = Dependency.Instance.getApplicationSerivce(DEPConsts.ImageLoader);
  }

  async findAllSanPhams(nhaccId: string): Promise<SanPham[]> {
    let listSanPhamDTO = await this.sanphamRepo.getSanPhamByIdNhaCC(nhaccId);
    let listSanPhams = await Promise.all(listSanPhamDTO.map(dto => SanPham.create(dto, CreateType.getGroups().loadFromPersistence)));
    return listSanPhams.map(sanpham => sanpham.getValue());
  }

  async findNhaCungCapById(nhaccId: string) {
    let nhacungcapDTO = await this.repo.getNhaCungCapById(nhaccId);
    if (!nhacungcapDTO) {
      return FailResult.fail(new EntityNotFound(NhaCungCap));
    }
    const createNhaCungCap = await NhaCungCap.create(nhacungcapDTO, CreateType.getGroups().loadFromPersistence); 
    return SuccessResult.ok(createNhaCungCap.getValue());
  }

  async updateAnhDaiDien(nhacungcapParam: string | NhaCungCap, imageFile: "usedefault" | any) {
    let nhaCungCap: NhaCungCap;
    if (nhacungcapParam instanceof String) {
      const findNhaCungCap = await this.findNhaCungCapById(nhacungcapParam as string);
      if (findNhaCungCap.isFailure) {
        return FailResult.fail(findNhaCungCap.error);
      }
      nhaCungCap = findNhaCungCap.getValue(); 
    } else {
      nhaCungCap = nhacungcapParam as NhaCungCap;
    }
    if (imageFile !== "usedefault") {
      let isImageAllowed = this.imageLoader.isFileAllowed(imageFile);
      if (!isImageAllowed) {
        return FailResult.fail(new Error("Hình ảnh không hợp lệ"));
      }
    }
    let url = await this.imageLoader.upload(imageFile, FOLDERS.SanPham);
    nhaCungCap.updateAnhDaiDien(url);
    return SuccessResult.ok(null);
  }

  persist(nhacungcap: NhaCungCap): Promise<void> {
    return this.repo.update(nhacungcap);
  }
}