const fs = require('fs');
const path = require('path');

module.exports = {
  src: {
    'AndroidManifest.xml': fs.readFileSync(path.join(__dirname, '../files/AndroidManifest.xml')),
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
