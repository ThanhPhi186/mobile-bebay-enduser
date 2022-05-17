import { IBaseResponse } from "models/IBaseResponse";

export interface IInitDataRequest {
    deviceModel: string;
    osName: string;
    osVersion: string;
    appVersion: string;
    firebaseToken: string;
}
export interface IInitDataResponse extends IBaseResponse {
    rsaPrivateKey: string;
    rsaPublicKey: string;
    signatureKey: string
    accessToken? : string;
}