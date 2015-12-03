const fs = require('fs');
const path = require('path');
const android = require('./android');

const dependencies = {
  'react-native-vector-icons': {
    'package.json': fs.readFileSync(path.join(__dirname, '../files/dependency.json')),
    android: android.valid,
  },
  'rnpm-android-no-package': {
    'package.json': fs.readFileSync(path.join(__dirname, '../files/dependency.json')),
    android: android.noPackage,
  },
};

const flat = {
  android: android.valid,
  node_modules: dependencies,
};

const nested = {
  android: {
    app: android.valid,
  },
  node_modules: dependencies,
};

module.exports = {
  'testing/flat': flat,
  'testing/nested': nested,
  'testing/empty': {},
};
