/**
 * This is the entry file for `npm run dist`
 */

/**
 * build for `dist/lbk-common-components.css`
 * Note: Just import style. The pattern is different in `v0.9`. The difference is `(style\/)?`
 */
const req = require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.tsx?$/);
req.keys().forEach((mod) => {
  req(mod);
});

/**
 * build for `dist/lbk-common-components.js`
 */
module.exports = require('./components/index');
