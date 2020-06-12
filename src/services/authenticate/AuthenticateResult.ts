

export default interface AuthenticateResult<T> {
  valid: boolean;
  message: string;
  token?: string;
  data?: T;
}