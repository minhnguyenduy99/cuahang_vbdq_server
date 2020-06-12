import { IDatabaseRepoError, IDatabaseError } from "@core";


export default class KnexDBRepoError implements IDatabaseRepoError {

  constructor(
    public readonly repositoryName: string, 
    public readonly dbError?: IDatabaseError,
    public readonly message?: string){
  }

  getErrorInfo() {
    throw new Error("Method not implemented.");
  }
} 