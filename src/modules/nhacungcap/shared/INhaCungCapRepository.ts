import { NhaCungCap, NhaCungCapDTO } from "@modules/nhacungcap";

export default interface INhaCungCapRepository {

  getTongSoLuong(): Promise<number>;

  createNhaCungCap(nhacungcap: NhaCungCap): Promise<void>;

  nhaCungCapExists(tenNhaCungCap: string): Promise<boolean>;

  getNhaCungCapById(id: string): Promise<NhaCungCapDTO>;

  searchNhaCungCap(ten: string): Promise<NhaCungCapDTO[]>;

  update(nhacungcap: NhaCungCap): Promise<void>;
}