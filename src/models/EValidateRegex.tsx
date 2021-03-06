export default {
 VIETTEL_PHONE_PATTERN:
  '^[+]?(84|0)(98|97|96|163|164|165|166|167|168|169)[\\d]{7}$',
 EMAIL_PATTERN:
  '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
 NUMBER_PATTERN: /^(-|\\+)?[0-9]+(\\.[0-9]+)?$/,
 WEBSITE_ADDRESS_PATTERN:
  '(http(s)?://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ;,./?%&=]*)?',
 PHONE_PATTERN_MOBILE: /^[+]?(856|)(9|209|0209|309)[\d]{7}$/,
 NAME_PATTERN: /^[\p{L}0-9 ]{1,}$/,
 NAME_SPECIAL_CHARACTERS: /[-!@#$%^&*()+=\[\]{};':"\\|,.<>\/?_]+/,
 STRING_PATTERN: '[a-zA-Z ]+',
 SIMPLE_CHARACTER_PATTERN2: /^[a-zA-Z0-9 ]*$/,
 CHARACTER_PATTERN: /^[_a-zA-Z0-9]*$/,
 SIMPLE_CHARACTER_PATTERN: /^[a-zA-Z0-9]*$/,
 REGEX_CHARACTER_PHONE: /^([+]?(95|0|)(96)[\d]{8})|[_a-zA-Z0-9]$/,
 MONEY_PATTERN: /^[,\d]{1,13}$/,
 BANK_CODE: /^[a-zA-Z0-9]{1,6}$/,
 TRANSACTION_ID: /^[a-zA-Z0-9]{1,12}$/,
 ONLY_NUMBER_PATTERN: /^\d+$/,
 IDENTIFICATION_PATTERN: /^[a-zA-Z0-9]{1,12}$/,
 REMOVE_FIRST_ZERO: /^0+(?=\d)/,
 TRIM_SPACE: /\s+/,
 OTP_VALIDATE: /^[\d]{6}$/g,
 PIN_VALIDATE: /^[\d]{6,8}$/g,
 // ONLY_NUMBER: /([^0-9]+)/gi,
 NUMBER_ID_PATTERN: /^[a-zA-Z0-9]{1,25}$/,
 SPECIAL_AND_CHARACTERS: /[a-zA-Z!@#$%^&*()/+=-\[\]{};':"\\|<>\?_,]+/,
 ONLY_NUMBER: /([^0-9])/gi,
 CONTRACT_NUMBER: /[!@#$%^&*()]+/,
}
