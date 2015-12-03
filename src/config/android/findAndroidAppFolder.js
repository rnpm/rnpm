const fs = require('fs');
const path = require('path');

module.exports = function findAndroidAppFolder(folder) {
  if (!fs.existsSync(path.join(folder, 'android'))) {
    return null;
  }

  if (fs.existsSync(path.join(folder, 'android', 'app'))) {
    return path.join('android', 'app');
  }

  return 'android';
};
