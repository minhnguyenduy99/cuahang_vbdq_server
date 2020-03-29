

export default interface IService {
  start(): Promise<boolean>;

  end(): Promise<void>;
}