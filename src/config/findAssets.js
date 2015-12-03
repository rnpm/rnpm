const glob = require('glob');
const path = require('path');

const findAssetsInFolder = (folder) =>
  glob.sync(path.join(folder, '**'), { nodir: true });

module.exports = function findAssets(folder, assets) {
  return (assets || [])
    .map(assetsFolder => path.join(folder, assetsFolder))
    .reduce((assets, assetsFolder) =>
      assets.concat(findAssetsInFolder(assetsFolder)),
      []
    );
};
