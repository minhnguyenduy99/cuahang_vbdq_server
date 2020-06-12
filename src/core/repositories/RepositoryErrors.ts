import { IAppError } from "../application";

export interface IRepositoryError extends IAppError {
  readonly repositoryName: string;
}

export class InvalidRepoActionError implements IRepositoryError {
  repositoryName: string;
  message: string;

  constructor(repoName: string, message?: string) {
    this.repositoryName = repoName;
    this.message = message;
  }
  
  getErrorInfo() {
    throw new Error("Method not implemented.");
  }
} 