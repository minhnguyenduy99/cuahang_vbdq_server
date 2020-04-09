import cloudinary from "cloudinary";
import { IApplicationService } from "@modules/services/ApplicationService";

const cloudinary_v2 = cloudinary.v2;

interface UploadFile {

}

export default class ImageLoader implements IApplicationService {

  async start(): Promise<boolean> {
    await this.config();
    return true;
  }

  async end(): Promise<void> {
    throw new Error("Method not implemented.");
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
    cloudinary_v2.config({
      cloud_name: 'dml8e1w0z', 
      api_key: '221949179788151', 
      api_secret: 'T2O9uzGP6JzsLwsyEp-YqwMWPHI',
    })
  }
}
