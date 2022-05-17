import { BILL_TYPE } from 'models/EBillType';
import { INew } from 'models/INew';
import { IBillResponse } from 'models/services/IBill';
import { ICurrentLocation } from 'models/services/ICashin';
import { IDataResponse } from 'models/services/IData';
import { IScanAccountInfo } from 'models/services/IQRScan';
import { IRecentTrans } from 'models/services/IRecent';
import { ITopUpResponse } from 'models/services/ITopUp';
import { ITransferResponse } from 'models/services/ITransfer';
import { IWithdrawResponse } from 'models/services/IWithDraw';
import { IListAllTransaction } from 'models/services/ITransaction';

export type RouteParamList = {
  Login: undefined;
  Invite: undefined;
  PinCode: undefined;
  OnBoardingScreen: undefined;
  SelectLanguage: undefined;
  OTPLogin: { transId: string; pin?: string } | undefined;
  TermsOfUse: undefined;
  Register: undefined;
  CashIn: undefined;
  Home: undefined;
  TransferMoney: { accountInfo: IScanAccountInfo } | undefined;
  ConfirmDetail: { transferData: ITransferResponse } | undefined;
  TransactionResult: { transactionResult: ITransferResponse } | undefined;
  SearchService: undefined;
  TransferBank: undefined;
  Transaction: { transactionType: string } | undefined;
  Profile: undefined;
  TabRoute:
  | undefined
  | {
    screen?: 'Home' | 'Profile' | 'Promotion' | 'Transaction' | 'QRScan';
    params?: any;
  };
  TopUp: { accountInfo: IScanAccountInfo } | undefined;
  ConfirmTopUp: { checkTopUpData: ITopUpResponse } | undefined;
  TopUpResult: { topUpResult: any } | undefined;
  DataExchange: { accountInfo: IScanAccountInfo } | undefined;
  BuyData: {
    dataInfo: IDataResponse;
    accountInfo?: IScanAccountInfo;
  };
  ConfirmData: { dataInfo: IDataResponse; receiversPhone: string } | undefined;
  DataResult: { dataResult: IDataResponse } | undefined;
  ConfirmRegister: undefined;
  ChangePin: undefined;
  CashOut: undefined;
  Withdraw: undefined;
  ConfirmWithdraw:
  | { withdrawInfo: IWithdrawResponse; agentCode: string }
  | undefined;
  WithdrawResult: { withdrawResult: IWithdrawResponse } | undefined;
  MapScreen: { currentLocation: ICurrentLocation } | undefined;
  MyQr: undefined;
  QRScan: undefined;
  RegisterResult: undefined;
  PromotionDetail: { promotion: INew } | undefined;
  Bill: { type?: BILL_TYPE } | undefined;
  BillDebit: { transferData?: IBillResponse; type?: BILL_TYPE } | undefined;
  BillDetail: { transferData?: IBillResponse } | undefined;
  PaymentResult: undefined;
  ComingSoon: undefined;
  About: undefined;
  FeeAndLimit: undefined;
  Notifications: undefined;
  AllRecentTransaction:
  | { featureCode: string; onSelectItem: (item: IRecentTrans) => void }
  | undefined;
  TransactionDetail: { dataTransaction?: IListAllTransaction } | undefined;
};

export const ProtectedScreens: Array<keyof RouteParamList> = [
  'TransferMoney',
  'TopUp',
  'TransferBank',
  // 'Profile',
  'Transaction',
  'QRScan',
  'Bill',
  'DataExchange',
  'ChangePin',
  'Notifications',
  "BuyData"
];
