const fs = require('fs-extra');

/**
 * Copies each file from an array of assets provided to targetPath directory
 */
module.exports = function copyAssetsAndroid(assets, targetPath) {
  (assets || []).forEach(asset => {
    fs.copySync(asset, targetPath);
  });
};
