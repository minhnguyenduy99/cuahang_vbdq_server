import { IAppError } from "../application/core-error";


export default interface IDatabaseError extends IAppError {
  type?: string;
}