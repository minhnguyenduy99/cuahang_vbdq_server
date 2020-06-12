import { IRepositoryError } from "../repositories";
import { IDatabaseError } from ".";

export default interface IDatabaseRepoError extends IRepositoryError {
  readonly dbError?: IDatabaseError;
}