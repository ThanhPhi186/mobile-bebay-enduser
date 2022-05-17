import {JSHmac, CONSTANTS} from 'react-native-hash';
import {NativeModules, Platform} from 'react-native';

import RSA from 'react-native-fast-rsa';

var Aes = NativeModules.Aes;
export const encryptString = async (text: string, publicRsa: string) => {
  try {
    console.log('ASDSADDSA =>>', text, publicRsa);
    const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\n${publicRsa}\n-----END PUBLIC KEY-----`;
    const encryptText = await RSA.encryptPKCS1v15(text, PUBLIC_KEY);
    return encryptText.replace(/(\r\n|\n|\r)/gm, '').trim();
  } catch (error) {
    return `${publicRsa}`;
  }
};
// export const generateKeys = async () => {
//   const keys = await RSA.generateKeys(2048);
//   console.log(keys.private); // the private key
//   console.log('public:', keys.public); // the public key
// };

const androidEncodedMessage = `Z3iPkJiJCrXLaT11RtwBuSJa4rGbJ7JfDSHMNn/UaLUnGIzFmMT6ZRMtaSmWJhw3pXBES1IqufJB
  Wk5vdZuDD7o5AP8i5GHrgVGbf6ix6DIH1+PiJzcfwBcSdEuCMEsustk+tBirK/HuxYt0HQV3B8Sw
  EFAFOAPh3y2CsSC7Ibn5Q5cWeDYxfs8XANezs0H3i/X+KZP8owIrKnsERErc0E6bJ/V3tGCoFb+5
  m0SibGo5B446iH57hTHf3Sv6GYcThk5+BqP/08VVQ2YXy+oMPng2nVnvzGONdJzfq+9GAKWMx6CE
  yiSiGz7AYGDb04FmekL8KqEKy6nTlVERlbwWRg==`;

export const decryptString = async (text: string, privateRsa: string) => {
  try {
    const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----\n${privateRsa}\n-----END RSA PRIVATE KEY-----`;
    const originText = await RSA.decryptPKCS1v15(text, PRIVATE_KEY);
    return originText.replace(/(\r\n|\n|\r)/gm, '').trim();
  } catch (error) {
    return `${privateRsa}`;
  }
};

export const encryptSha256 = async (text: string, signature: string) => {
  try {
    const encryptedString = await JSHmac(
      text,
      signature,
      CONSTANTS.HmacAlgorithms.HmacSHA256,
    );
    return encryptedString;
  } catch (error) {
    return `${signature}`;
  }
};
