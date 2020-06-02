import { ChiTietPhieuBHDTO, ChiTietPhieuBH } from ".";
import { CTPhieuMapper } from "@modules/phieu/shared";

export default class CTPhieuBHMapper extends CTPhieuMapper {
  
  toDTOFromPersistence(data: any) {
    let ctphieuDTO = super.toDTOFromPersistence(data);
    if (!ctphieuDTO) {
      return
    }   
    return {
      ...ctphieuDTO,
      sp_id: data.sp_id
    } as ChiTietPhieuBHDTO;
  }
  
  toPersistenceFormat(ctphieu: ChiTietPhieuBH) {
    let superPersistence = super.toPersistenceFormat(ctphieu);
    return {
      ...superPersistence,
      sp_id: ctphieu.hangHoa.getId()
    }
  }
}