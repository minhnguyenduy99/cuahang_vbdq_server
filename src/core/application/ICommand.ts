import { IUseCase, Result } from ".";
import { IDatabaseError } from "../database";
import { Entity } from "./domain";
import { IAppError } from "./core-error";


export default interface ICommand<IRequest> extends IUseCase<IRequest, Result<void, IAppError | any>> {
  
  isCommit(): boolean;
  
  commit(): Promise<Result<any, IDatabaseError>>;

  rollback(): Promise<void>;

  getData(): Entity<any>;
}