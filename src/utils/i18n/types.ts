export type ConvertedToObjectType<T> = {
  [P in keyof T]: T[P] extends string ? string : ConvertedToObjectType<T[P]>;
} & {
  [P: string]: any;
};

// Selecting the json file that our intellisense would pick from
export type TranslationJsonType = typeof import("./lang/en/translation.json");