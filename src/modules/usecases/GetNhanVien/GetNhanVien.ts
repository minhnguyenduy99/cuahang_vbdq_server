import { IUseCase, UniqueEntityID } from "@core";
import { IsString } from "class-validator";
import { Expose } from "class-transformer";
import INhanVienRepository from "../../nhanvien/INhanVienRepository";

export class GetNhanVienDTO {
  
  @IsString()
  @Expose({ name: "nv_id" })
  id: string;
}


export class GetNhanVien implements IUseCase<GetNhanVienDTO, any> {
  
  private repo: INhanVienRepository;

  constructor(repo: INhanVienRepository) {
    this.repo = repo;
  }
  
  async execute(request: GetNhanVienDTO) {
    const createIdResult = UniqueEntityID.create(request.id);
    if (createIdResult.isFailure) {
      return createIdResult;
    }
    const result = await this.repo.getNhanVienById(createIdResult.getValue());
    return result;
  }
}