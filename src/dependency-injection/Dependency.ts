import { 
  IApplicationService, 
  ApplicationService, 
  IAppSettings, 
  IDatabaseRepository, 
  IDatabaseService, 
  IDbConnection, 
  IDomainService,
  DomainService} from "@core";

export interface Type<T> {
  new (...args: any[]): T;
}

export interface RepoType<T extends IDatabaseRepository<any>> extends Type<T> {
  new (conn: IDbConnection<any>, tableName?: string): T;
}

export interface ServiceType<T extends IApplicationService> extends Type<T> {
  new (appSettings?: IAppSettings): T;
}

export interface DomainServiceType<T extends IDomainService> extends Type<T> {
  new (...args: any[]): T;
}


export class Dependency {

  protected static instance: Dependency;

  protected appSettings: IAppSettings;

  protected repositories: { [repoName: string]: any } = {};

  protected registers : { [key: string]: any } = {};

  protected dbConnection: IDbConnection<any>;

  protected dbService: IDatabaseService;

  private constructor(appSettings: IAppSettings) {
    this.appSettings = appSettings;
  } 

  /**
   * Register the database service for the application
   * @param type 
   */
  async setDatabaseService<T extends IDatabaseService>(type: ServiceType<T>) {
    this.registerApplicationService(type);
    this.dbService = this.getApplicationSerivce(type);
    this.dbConnection = this.dbService.getDbConnection();
    this.dbService.start();
  }
  
  register<T>(instance: T) {
    this.registers[typeof instance] = instance;
  }

  get<T>(type: Type<T>) {
    return this.registers[type.name] as T;
  }

  registerDomainService<T>(type: DomainServiceType<T>) {
    DomainService.createService(type);
  }

  getDomainService<T>(type: DomainServiceType<T>, ...args: any[]) {
    return DomainService.getService(type, args);
  }
  
  registerApplicationService<T>(type: ServiceType<T>) {
    ApplicationService.createService(type, this.appSettings);
  }

  getApplicationSerivce<T>(type: ServiceType<T>) {
    return ApplicationService.getService(type);
  }

  /**
   * @param tableName The name of table in the database corresponding to this repository
   */
  registerRepository(type: RepoType<IDatabaseRepository<any>>, tableName?: string) {
    let repo = this.dbService.createRepository(type, tableName);
    this.repositories[type.name] = repo;
  }

  getRepository<T extends IDatabaseRepository<any>>(type: Type<T>) {
    return this.repositories[type.name] as T;
  }

  static get Instance() {
    return this.instance;
  }

  static create(appSettings: IAppSettings) {
    this.instance = new Dependency(appSettings);
    return this.instance;
  }
}
