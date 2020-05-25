import { IRepositoryError, Result } from "@core";
import { NhaCungCap, NhaCungCapDTO } from "./NhaCungCap";

export default interface INhaCungCapRepository {

  createNhaCungCap(nhacungcap: NhaCungCap): Promise<Result<void, IRepositoryError>>;

  nhaCungCapExists(tenNhaCungCap: string): Promise<Result<boolean, IRepositoryError>>;

  getNhaCungCapById(id: string): Promise<Result<NhaCungCapDTO, IRepositoryError>>;

  searchNhaCungCap(ten: string): Promise<Result<NhaCungCapDTO[], IRepositoryError>>;

  update(nhacungcap: NhaCungCap): Promise<Result<void, IRepositoryError>>;
}