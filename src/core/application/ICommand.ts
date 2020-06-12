import { IUseCase, Result } from ".";
import { Entity } from "./domain";
import { IAppError } from "./core-error";


export default interface ICommand<IRequest> extends IUseCase<IRequest, Result<void, IAppError | any>> {
  
  isCommit(): boolean;
  
  commit(): Promise<any>;

  getData(): Entity<any> | Entity<any>[] | any;
}