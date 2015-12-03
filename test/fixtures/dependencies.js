const fs = require('fs');
const path = require('path');
const android = require('./android');

const pjson = fs.readFileSync(path.join(__dirname, './files/dependency.json'));

module.exports = {
  'react-native-vector-icons': {
    'package.json': pjson,
    android: android.valid,
  },
  'rnpm-android-no-package': {
    'package.json': pjson,
    android: android.noPackage,
  },
};
