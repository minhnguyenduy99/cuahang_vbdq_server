import { Result } from "./Result";
import { IDatabaseError } from "../database";
import { Entity } from "@core";
export default interface IDomainService {
  
  persist(entity: Entity<any>): Promise<Result<any, IDatabaseError>>;
}