import { Result, DomainServiceError, DomainService, IRepositoryError, IDomainService } from "@core";
import { NhaCungCap } from "@modules/nhacungcap";
import { EntityNotFound } from "@core";
import { SanPham } from "@modules/sanpham";


export default interface INhaCungCapService extends IDomainService {

  findAllSanPhams(nhaccId: string) : Promise<SanPham[]>;

  findNhaCungCapById(nhaccId: string): Promise<Result<NhaCungCap, EntityNotFound>>;

  updateAnhDaiDien(nhacungcapId: string, imageSource: string): Promise<void>;

  persist(nhacungcap: NhaCungCap): Promise<void>;
}