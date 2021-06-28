const fs = require('fs');
const path = require('path');
const ms = require('ms');
const express = require('express');
const app = express();
const compression = require('compression');

const config = require('../config/index.js');

const IP = config.buildtime.originServer.ip;
const PORT = config.buildtime.originServer.port;

(function injectConfig() {
  const configScript = `<!--configArea--><script>window.CODEMAOCONFIG = ${JSON.stringify(config.runtime)}</script><!--endOfConfigArea-->`;
  const htmlPath = path.join(__dirname, '../build/index.html');
  let htmlData = fs.readFileSync(htmlPath, { encoding: 'utf8' });

  htmlData = htmlData.replace(/<!--configArea-->(.)*<!--endOfConfigArea-->/, configScript);
  fs.writeFileSync(htmlPath, htmlData);
})();


app.use(compression());

app.use(express.static(path.join(__dirname, '../build/'), {
  etag: true,
  lastModified: true,
  maxAge: ms('10 days'),
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-cache');
    }
  },
}));

app.use(function(req, res, next) {
  if (/^\/MP_verify_/.test(req.path)) {
    res.send(req.path.match(/\/MP_verify_(.*).txt/)[1]);
  } else {
    next();
  }
});

app.use((req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, '../build/'));
});

app.listen(PORT, () => {
  console.log(`The app server is working at: http://${IP}:${PORT}`);
});
