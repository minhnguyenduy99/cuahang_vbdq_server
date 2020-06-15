import UploadFile from "./UploadFile";


export default interface IImageLoader {
  /**
   * 
   * @param file The image file to be loaded
   * @param folder The folder location to store the file
   * @returns The location of the stored file
   */
  upload(file: "usedefault" | UploadFile, folder: string): Promise<string>;

  delete(url: string): Promise<boolean>;

  isFileAllowed(file: UploadFile | "usedefault"): boolean;
}