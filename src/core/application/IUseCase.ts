
export default interface IUseCase<IRequest, IRespone> {

  execute(request: IRequest): Promise<IRespone> | IRespone;
}
