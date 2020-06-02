import { FailResult, SuccessResult, EntityNotFound } from "@core";
import { Dependency, DEPConsts } from "@dep";
import { CreateType } from "@modules/core";
import { NhaCungCap, INhaCungCapRepository } from "@modules/nhacungcap";
import { INhaCungCapService } from "./shared";
import { ISanPhamRepository, SanPham } from "@modules/sanpham";

export default class NhaCungCapService implements INhaCungCapService {
  
  private repo: INhaCungCapRepository;
  private sanphamRepo: ISanPhamRepository;
  
  constructor() {
    this.repo = Dependency.Instance.getRepository(DEPConsts.NhaCungCapRepository);
    this.sanphamRepo = Dependency.Instance.getRepository(DEPConsts.SanPhamRepository);
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

  async updateAnhDaiDien(nhacungcapId: string, imageSource: string) {
    let nhacungcapDTO = await this.repo.getNhaCungCapById(nhacungcapId); 
    const createNhaCC = await NhaCungCap.create(nhacungcapDTO, CreateType.getGroups().loadFromPersistence);
    const nhacc = createNhaCC.getValue();
    nhacc.updateAnhDaiDien(imageSource);
    // persist changes to repository collection
    this.persist(nhacc);
  }

  persist(nhacungcap: NhaCungCap): Promise<void> {
    return this.repo.update(nhacungcap);
  }
}