const fs = require('fs');

const android = {
  src: {
    'AndroidManifest.xml': fs.readFileSync('test/fixtures/files/AndroidManifest.xml'),
    main: {
      com: {
        some: {
          example: {
            'Main.java': fs.readFileSync('test/fixtures/files/Main.java'),
          },
        },
      },
    },
  },
};

module.exports = {
  node_modules: {
    'react-native-vector-icons': {
      'package.json': fs.readFileSync('test/fixtures/files/vector-icons.json'),
      android,
    },
  },
  android,
};
