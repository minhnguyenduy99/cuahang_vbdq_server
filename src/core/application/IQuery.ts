import { IUseCase, Result } from ".";

export default interface IQuery<IRequest> extends IUseCase<IRequest, Result<any, any>> {

  validate(request: IRequest): Promise<Result<any, any[]>>;
}