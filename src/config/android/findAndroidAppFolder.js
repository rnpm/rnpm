const fs = require('fs');
const path = require('path');

/**
 * @param  {String} folder Folder to seek in
 * @return {String}
 */
module.exports = function findAndroidAppFolder(folder) {
  if (!fs.existsSync(path.join(folder, 'android'))) {
    return null;
  }

  if (fs.existsSync(path.join(folder, 'android', 'app'))) {
    return path.join('android', 'app');
  }

  return 'android';
};
