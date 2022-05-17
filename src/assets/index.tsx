import _ from 'lodash';
import {ImageType} from 'models/IImage';
import {INew} from 'models/INew';
import {BASE_API_URL} from 'utils/Const';
import * as images from './images/index';
export const getImageUrlFromNew = (item: INew) => {
  const image = _.find(item.images, x => x.imageType === ImageType.BANNER);
  return `${BASE_API_URL}/assets${image?.url}`;
};
export const getAvatarUrlFromNew = (item: INew) => {
  const image =
    _.find(item.images, x => x.imageType === ImageType.AVATAR) ||
    _.find(item.images, x => x.imageType === ImageType.BANNER);
  return `${BASE_API_URL}/assets${image?.url}`;
};
export {images};
