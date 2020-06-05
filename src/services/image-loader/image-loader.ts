import cloudinary from "cloudinary";
import { IAppSettings, ApplicationService } from "@core";
import IImageLoader from "./IImageLoader";
import { ALLOW_IMAGE_EXT } from "./shared";

const cloudinary_v2 = cloudinary.v2;

interface SettingsData {
  url?: string;
  name?: string;
  apiKey?: string;
  apiSecret?: string;
  folders: {[folderName: string]: string};
}

export class ImageLoader extends ApplicationService<SettingsData> implements IImageLoader {
  
  protected defaultFolders: { [folderName: string]: string} = {};

  constructor(appSettings: IAppSettings) {
    super(appSettings);
    this.config();
    this.defaultFolders = this.serviceData.folders;
  }

  protected getAppSettings(settings: IAppSettings): SettingsData {
    return settings.getValue("remoteImageServer") as SettingsData;
  }

  isFileAllowed(file: any): boolean {
    if (!file) {
      return false;
    }
    let parts = file ? file.name.split('.') : [""];
    let ext = parts[parts.length - 1];
    return ALLOW_IMAGE_EXT.includes(ext);
  }

  async upload(file: any, folder: string) {
    try {
      if (!this.isFileAllowed(file)) {
        return this.loadDefaultImage(folder);
      }
      const result = await cloudinary_v2.uploader.upload(file.path, { folder: folder });
      return result.url;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private loadDefaultImage(folder: string) {
    return this.defaultFolders[folder] ?? null;
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
