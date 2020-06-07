

export default interface IImageLoader {
  /**
   * 
   * @param file The image file to be loaded
   * @param folder The folder location to store the file
   * @returns The location of the stored file
   */
  upload(file: "usedefault" | any, folder: string): Promise<string>;

  isFileAllowed(file: any): boolean;
}