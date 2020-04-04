import { IUseCase, Result } from ".";
import { IDatabaseError } from "../database";

export default interface IQuery<IRequest> extends IUseCase<IRequest, Result<any, any>> {

}