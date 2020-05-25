import { Result, DomainServiceError, DomainService, IRepositoryError, IDomainService } from "@core";
import { NhaCungCap } from "@modules/nhacungcap";
import { EntityNotFound } from "../DomainService";


export default interface INhaCungCapService extends IDomainService {

  findNhaCungCapById(nhaccId: string): Promise<Result<NhaCungCap, EntityNotFound | IRepositoryError>>;

  updateAnhDaiDien(nhacungcapId: string, imageSource: string): Promise<boolean>;

  persist(nhacungcap: NhaCungCap): Promise<Result<void, IRepositoryError>>;
}