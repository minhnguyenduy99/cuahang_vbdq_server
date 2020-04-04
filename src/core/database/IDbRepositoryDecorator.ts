import { IDatabaseRepository } from ".";


export default interface IDbRepositoryDecorator<Context> extends IDatabaseRepository<Context> {
  
  getRepo(): IDatabaseRepository<Context>;
  
  execute(context: Context): any;
}