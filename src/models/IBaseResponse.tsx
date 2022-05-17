export interface IBaseResponse {
  status: number;
  code: string;
  message: string;
  otpExpiredInSecond?: number;
  requireOtp?: boolean;
  transId?: string;
}
