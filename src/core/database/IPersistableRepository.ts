import { IDatabaseRepository, IDatabaseError } from ".";
import { Entity, Result } from "@core";

export default interface IPersistableRepository<Context> extends IDatabaseRepository<Context> {

  persist(model: Entity<any>): Promise<Result<void, IDatabaseError>>;
}