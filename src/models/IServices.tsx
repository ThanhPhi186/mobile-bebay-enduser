import {images} from 'assets';
import {translations} from 'utils/i18n';
import i18n from 'i18next';

export interface IService {
  id: string;
  title: string;
  icon: any;
}
export const ServiceList: IService[] = [
  {
    id: 'deposit',
    title: 'Deposit',
    icon: images.iconDeposit,
  },
  {
    id: 'withDraw',
    title: 'Withdraw',
    icon: images.IconWithdraw,
  },
  {
    id: 'transferMoney',
    title: 'Transfer Money',
    icon: images.IconTransferMoney,
  },
  {
    id: 'myQR',
    title: 'My QR',
    icon: images.iconMyQr,
  },
];
export const PaymentServiceList: IService[] = [
  {
    id: 'transferMoney',
    title: 'Transfer Money',
    icon: images.IconTransferMoney,
  },
  {
    id: 'withDraw',
    title: 'Withdraw',
    icon: images.IconWithdraw,
  },
  {
    id: 'reCharge',
    title: 'Recharge',
    icon: images.IconTopUp,
  },
  {
    id: 'internet',
    title: i18n.t(translations.paymentService.natcomInternet),
    icon: images.iconBill,
  },
  {
    id: 'payMerchant',
    title: 'Pay Merchant',
    icon: images.icon_pay_merchant,
  },
  {
    id: 'transferBank',
    title: 'Transfer Bank',
    icon: images.IconTransferBank,
  },
  {
    id: 'postpaid',
    title: i18n.t(translations.paymentService.natcomPostPaid),
    icon: images.icon_lumitel,
  },
  {
    id: 'reCharge',
    title: 'Recharge',
    icon: images.icon_all_service,
  },
];
