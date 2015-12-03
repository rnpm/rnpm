const fs = require('fs');
const path = require('path');
const android = require('./android');

module.exports = {
  android,
  node_modules: {
    'react-native-vector-icons': {
      'package.json': fs.readFileSync(path.join(__dirname, '../files/vector-icons.json')),
      android,
    },
  },
};
