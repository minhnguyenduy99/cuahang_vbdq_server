import jwt from "jsonwebtoken";
import { ApplicationService, IAppSettings } from "@core";
import ITokenizer from "./ITokenizer";

interface EncryptSetting {
  secretKey: string;
}


export default class Tokenizer extends ApplicationService<EncryptSetting> implements ITokenizer<any> {
  
  async sign(data: any): Promise<string> {
    let token = jwt.sign(data, this.serviceData.secretKey);
    return token;
  }

  async vertify(token: string): Promise<any> {
    try {
      let data = jwt.decode(token);
      return data;
    } catch (err) {
      console.log(err)
      return null;
    }
  }

  protected getAppSettings(settings: IAppSettings): EncryptSetting {
    return {
      secretKey: settings.getValue("authPrivateKey") || ""
    }
  }
}