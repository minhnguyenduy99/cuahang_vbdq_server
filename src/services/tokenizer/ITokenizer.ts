import { IApplicationService } from "@core";


export default interface ITokenizer<Data> extends IApplicationService {
  
  sign(data: Data): Promise<string>;

  vertify(token: string): Promise<Data>;
}