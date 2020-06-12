import { IApplicationService } from "@core";
import AuthenticateResult from "./AuthenticateResult";

export default interface IAuthenticate<Data> extends IApplicationService {

  authenticate(data: Data): Promise<AuthenticateResult<any> | any>;

  verifiedByToken(token: string): Promise<any>;
}