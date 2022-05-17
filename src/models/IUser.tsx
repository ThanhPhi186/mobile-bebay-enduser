export interface IUser {
  accountNumber: string;
  fullName: string;
  gender: number;
  consumerQrCode: string;
  accountType: EAccountType | number;
}
export enum EAccountType {
  BASIC,
  GOLD,
}
