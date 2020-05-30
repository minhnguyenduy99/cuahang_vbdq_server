import { IRepositoryError, Result } from "@core";
import { NhaCungCap, NhaCungCapDTO } from "./NhaCungCap";

export default interface INhaCungCapRepository {

  createNhaCungCap(nhacungcap: NhaCungCap): Promise<void>;

  nhaCungCapExists(tenNhaCungCap: string): Promise<boolean>;

  getNhaCungCapById(id: string): Promise<NhaCungCapDTO>;

  searchNhaCungCap(ten: string): Promise<NhaCungCapDTO[]>;

  update(nhacungcap: NhaCungCap): Promise<void>;
}