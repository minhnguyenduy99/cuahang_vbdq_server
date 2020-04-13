import { IDomainService, Result, IDatabaseError, FailResult, UnknownAppError, SuccessResult } from "@core";
import CreateType from "@create_type";
import { NhaCungCap, INhaCungCapRepository } from "@modules/nhacungcap";

import EntityNotFound from "./EntityNotFound";

export default class NhaCungCapService implements IDomainService {
  
  constructor(
    private repo: INhaCungCapRepository
  ) {
  }

  async findNhaCungCapById(nhaccId: string) {
    let retrieveNhaCungCap = await this.repo.getNhaCungCapById(nhaccId);
    if (retrieveNhaCungCap.isFailure) {
      return FailResult.fail(retrieveNhaCungCap.error);
    }
    const dto = retrieveNhaCungCap.getValue();
    if (!dto) {
      return FailResult.fail(new EntityNotFound(NhaCungCap));
    }
    const createNhaCungCap = await NhaCungCap.create(dto, CreateType.getGroups().loadFromPersistence);
    if (createNhaCungCap.isFailure) {
      return FailResult.fail(new UnknownAppError());
    } 
    return SuccessResult.ok(createNhaCungCap.getValue());
  }

  async updateAnhDaiDien(nhacungcapId: string, imageSource: string) {
    let nhacungcapDTO = await this.repo.getNhaCungCapById(nhacungcapId); 
    if (nhacungcapDTO.isFailure || !nhacungcapDTO.getValue()) {
      return false;
    }
    const createNhaCC = await NhaCungCap.create(nhacungcapDTO.getValue(), CreateType.getGroups().loadFromPersistence);
    if (createNhaCC.isFailure) {
      return false;
    }
    const nhacc = createNhaCC.getValue();
    nhacc.updateAnhDaiDien(imageSource);

    // persist changes to repository collection
    this.persist(nhacc);
  }

  persist(nhacungcap: NhaCungCap): Promise<Result<void, IDatabaseError>> {
    return this.repo.update(nhacungcap);
  }
}