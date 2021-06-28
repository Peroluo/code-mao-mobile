// this file is not used if use https://github.com/ant-design/babel-plugin-import
const ENV = process.env.NODE_ENV;
if (
  ENV !== 'production' &&
ENV !== 'test' &&
typeof console !== 'undefined' &&
console.warn &&
typeof window !== 'undefined'
) {
  // tslint:disable-next-line:no-console
  console.warn(
    'You are using a whole package of code-mao-mobile, ' +
    'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.',
  );
}

export { default as Button } from './button/index';
export { default as Icon } from './icon/index';
export { default as NoticeBar } from './notice-bar/index';

export { default as List } from './list/index';
export { default as WhiteSpace } from './white-space/index';
export { default as WingBlank } from './wing-blank/index';
export { default as Address } from './address';

