
export enum ApplicationMode {
  Development,
  Prduction
}

export default interface IAppSettings {

  getValue(key: string): any;
  
  getDbConnectionData(): any;

  getApplicationMode(): ApplicationMode;
}