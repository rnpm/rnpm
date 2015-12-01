const path = require('path');
const fs = require('fs');

/**
 * Get config from specific folder
 * @param  {String} cwd Folder to lookup
 * @return {Object}
 */
module.exports = function getConfig(cwd) {
  const packagePath = path.join(cwd, 'package.json');

  if (!fs.existsSync(packagePath)) {
    throw Error(`There's no package.json file in "${cwd}" directory`);
  }

  return require(packagePath);
};
