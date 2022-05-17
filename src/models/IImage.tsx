export interface IImage {
  id: number;
  language: string;
  url: string;
  imageType: ImageType | string;
}

export enum ImageType {
  BANNER = 'BANNER',
  AVATAR = 'AVATAR',
  HOME_BANNER = 'HOME_BANNER',
}
