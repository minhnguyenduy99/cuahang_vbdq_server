import cloudinary from "cloudinary";
import { IAppSettings, ApplicationService } from "@core";

const cloudinary_v2 = cloudinary.v2;

interface SettingsData {
  url?: string;
  name?: string;
  apiKey?: string;
  apiSecret?: string
}

export default class ImageLoader extends ApplicationService<SettingsData> {
  
  constructor(appSettings: IAppSettings) {
    super(appSettings);
    this.config();
  }

  protected getAppSettings(settings: IAppSettings): SettingsData {
    return settings.getValue("remoteImageServer") as SettingsData;
  }

  async upload(file: any) {
    try {
      const result = await cloudinary_v2.uploader.upload(file.path);
      return result.url;
    } catch (err) {
      console.log(err);
    }
  }

  private config() {
    const { apiKey, apiSecret, name } = this.serviceData;
    cloudinary_v2.config({
      cloud_name: name, 
      api_key: apiKey, 
      api_secret: apiSecret
    })
  }
}
