

export default interface AuthenticateResult {
  valid: boolean;
  message: string;
  token?: string;
  data?: any;
}