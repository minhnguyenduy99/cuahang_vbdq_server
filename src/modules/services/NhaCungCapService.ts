import { IDomainService, Result, IDatabaseError } from "@core";
import { NhaCungCap, INhaCungCapRepository } from "../nhacungcap";
import CreateType from "@create_type";



export default class NhaCungCapService implements IDomainService {
  
  constructor(
    private repo: INhaCungCapRepository
  ) {

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
    return this.repo.persist(nhacungcap);
  }
}