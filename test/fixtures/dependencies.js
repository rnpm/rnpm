const fs = require('fs');
const path = require('path');
const android = require('./android');

const pjson = fs.readFileSync(path.join(__dirname, './files/dependency.json'));

module.exports = {
  valid: {
    'package.json': pjson,
    android: android.valid,
  },
  withAssets: {
    'package.json': pjson,
    android: android.valid,
    fonts: {
      'A.ttf': '',
      'B.ttf': '',
      'C.jpg': '',
    },
  },
  noPackage: {
    'package.json': pjson,
    android: android.noPackage,
  },
};
