import 'react-native-elements';
type RecursivePartial<T> = {[P in keyof T]?: RecursivePartial<T[P]>};

declare module 'react-native-elements' {
  export interface Colors {
    background: string;
    border: string;
    text: string;
    altText: string;
    danger: string;
    inputAlternative: string;
    backgroundItem: string;
    disabledButton: string;
  }

  export interface FullTheme {
    colors: RecursivePartial<Colors>;
  }
}
