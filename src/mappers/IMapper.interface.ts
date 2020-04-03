import { Result, IAppError, IDatabaseError, Entity } from "@core";

export default interface IMapper<T extends Entity<any>> {

  toDTO(entity: T, exposeFields?: string[]): any;

  toDTOFromPersistence(data: any): Result<any, IDatabaseError>;

  toPersistenceFormat(entity: T): any;
}