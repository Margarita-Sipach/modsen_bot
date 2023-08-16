import * as ru from './locales/ru.json';

export const i18n = {} as { t: (name: string, args?: object) => string };

const fn = (name: string, args?: object) => {
  let needStr = `${name
    .split('.')
    .reduce((acc, item: string) => acc[item as keyof object], ru)}`;

  if (!args) return needStr;

  let resStr = '';

  while (true) {
    const startI = needStr.indexOf('${');
    const endI = needStr.indexOf('}');
    if (startI > -1) {
      const prevPart = needStr.slice(0, startI);
      const param = args[needStr.slice(startI + 2, endI) as keyof object];
      resStr = `${resStr}${prevPart}${param}`;
      needStr = needStr.slice(endI + 1);
    } else {
      resStr = `${resStr}${needStr}`;
      break;
    }
  }
  return resStr;
};
i18n.t = fn;
