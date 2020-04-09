import { Result } from "./Result";

export default interface IUseCase<IRequest, IRespone> {

  execute(request: IRequest): Promise<IRespone>;
}
