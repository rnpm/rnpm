const fs = require('fs');
const path = require('path');

const manifest = fs.readFileSync(path.join(__dirname, '../files/AndroidManifest.xml'));

exports.valid = {
  src: {
    'AndroidManifest.xml': manifest,
    main: {
      com: {
        some: {
          example: {
            'Main.java': fs.readFileSync(path.join(__dirname, '../files/Main.java')),
            'ReactPackage.java': fs.readFileSync(path.join(__dirname, '../files/ReactPackage.java')),
          },
        },
      },
    },
  },
};

exports.noPackage = {
  src: {
    'AndroidManifest.xml': manifest,
    main: {
      com: {
        some: {
          example: {
            'Main.java': fs.readFileSync(path.join(__dirname, '../files/Main.java')),
          },
        },
      },
    },
  },
};
