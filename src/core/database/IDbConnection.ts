
export default interface IDbConnection<type> {
  readonly name: string;

  getConnector(): type;

  connect(): Promise<boolean>;
}