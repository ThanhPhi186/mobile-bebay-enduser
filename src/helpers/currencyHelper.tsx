import _ from 'lodash';

function priceFixed(value?: number, precision: number = 2) {
  return parseFloat(
    Math.round(+(value?.toFixed(precision + 1) + 'e' + precision)) +
      'e-' +
      precision,
  );
}

export const formatPrice = (
  value: number | undefined,
  showCurrency = false,
) => {
  const price =
    value !== undefined
      ? `${showCurrency === true ? '$' : ''}${priceFixed(value, 2).toFixed(
          2,
        )}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')
      : '$0.00';
  return price;
};
export const parserPrice = (value: any) => value.replace(/\$\s?|(,*)/g, '');
export const formatBalance = (value: number | undefined, showCurrency = true) =>
  `${showCurrency === true ? '$' : ''}${priceFixed(value, 2) || 0}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  );

// export const formatPrice = (value: number): string =>
// 	`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// export const parserPrice = (value: any): string =>
// 	value.replace(/\$\s?|(,*)/g, '');

// export const formatAmount = (value: string) => value.replace(/^0+/, '')

export const isNumeric = (value: string): boolean => {
  return /^-?\d+$/.test(value);
};

export function formatAmount(x: string) {
  const formatter = Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  });
  if (_.last(x) === '.' || _.isEmpty(x)) {
    return x;
  }
  return formatter.format(Number(x));
  // return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export function formatString(x: string) {
  return x.replace(
    /[`W•√π÷×¶∆£¢€¥°©®™✓~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    '',
  );
}
export function random() {
  return Math.floor(Math.random() * 4) + 1;
  ;
}
