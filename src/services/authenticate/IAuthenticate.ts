import { ICommand, IQuery } from "@core";
import AuthenticateResult from "./AuthenticateResult";

export default interface IAuthenticate<Data> {

  authenticate(data: Data): Promise<AuthenticateResult>;

  verifyByToken(token: string): Promise<boolean>;
}