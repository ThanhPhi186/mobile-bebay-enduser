import { IBaseResponse } from 'models/IBaseResponse';
import { INew, INewCategory } from 'models/INew';
import { IPaginationRequest, IPaginationResponse } from './IPagination';
import i18next from 'i18next';
import { translations } from 'utils/i18n';
export interface INewRequest extends IPaginationRequest {
  promotionType: PROMOTION_TAG;
}
export interface INewResponse extends IBaseResponse {
  hotNews: INew[];
  data: IPaginationResponse<INew>;
  categoryPromotion: INewCategory[];
}
export interface IPromotionDetailRequest extends IPaginationRequest {
  id: number
}
export interface IPromotionDetailResponse extends IBaseResponse {
  categoryPromotion: INewCategory[];
}
export enum PROMOTION_TAG {
  ALL,
  HOT_DEAL,
  BIG_VOUCHER,
  PROMOTION,
}
export const PromotionTypes: { id: PROMOTION_TAG; title: string }[] = [
  { id: PROMOTION_TAG.ALL, title: i18next.t(translations.promotion.all) },
  {
    id: PROMOTION_TAG.HOT_DEAL,
    title: i18next.t(translations.promotion.hotDeal),
  },
  {
    id: PROMOTION_TAG.BIG_VOUCHER,
    title: i18next.t(translations.promotion.bigVoucher),
  },
  {
    id: PROMOTION_TAG.PROMOTION,
    title: i18next.t(translations.promotion.promotion),
  },
];
