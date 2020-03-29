import { Result, IAppError, IDatabaseError, Entity } from "@core";

export default interface IMapper<T extends Entity<any>> {

  toDTO(entity: T): any;

  toEntityFromDTO(dto: any): Result<T, IAppError>;

  toEntityFromPersistence(data: any): Result<T, IDatabaseError>;

  toPersistenceFormat(entity: T): any;
}