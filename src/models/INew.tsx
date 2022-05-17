import {IImage} from './IImage';

export interface INew {
  id: number;
  newsType: NEW_TYPE | string;
  contentType: number;
  title: string;
  shortContent: string;
  fullContent: string;
  images: IImage[];
}

export interface INewCategory {
  id: number;
  title: string;
}

export enum NEW_TYPE {
  NEWS = 'NEWS',
}
