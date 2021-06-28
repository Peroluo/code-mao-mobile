/* eslint-disable */
var fs = require('fs');
var path = require('path');
var analysisDir = path.join(__dirname,'../analysis');

if(fs.existsSync(analysisDir)) {

  console.log('generate versions.json for lbk-common-components');

  fs.readdir(analysisDir, function (err, files) {
    var versions = [];
    files.forEach(function (file) {
      var mobileStats = file.match(/^lbk-common-components@(.*).html$/);
      if (mobileStats && mobileStats.length) {
        versions.push(mobileStats[1]);
      }
    });
    fs.writeFileSync(path.join(analysisDir, 'lbk-common-components-versions.json'), JSON.stringify(versions));
  });
}
