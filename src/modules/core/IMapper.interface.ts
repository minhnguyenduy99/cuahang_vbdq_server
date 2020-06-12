import { Result, IDatabaseError, Entity } from "@core";

export default interface IMapper<T extends Entity<any>> {

  toDTO(entity: T): any;

  toDTOFromPersistence(data: any): Result<any, IDatabaseError> | any;

  toPersistenceFormat(entity: T): any;
}