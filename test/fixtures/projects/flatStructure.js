const fs = require('fs');
const path = require('path');
const android = require('./android');

module.exports = {
  android: android.valid,
  node_modules: {
    'react-native-vector-icons': {
      'package.json': fs.readFileSync(path.join(__dirname, '../files/dependency.json')),
      android: android.valid,
    },
    'rnpm-android-no-package': {
      'package.json': fs.readFileSync(path.join(__dirname, '../files/dependency.json')),
      android: android.noPackage,
    },
  },
};
