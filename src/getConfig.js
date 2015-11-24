const log = require('npmlog');
const efs = require('./utils/fs');
const transform = require('lodash.transform');
const path = require('path');

const getDefaultConfigAndroid = require('./android/getDefaultConfig');
const getDefaultConfigIOS = require('./ios/getDefaultConfig');
/**
 * Loads config for `rnpm` to use by projects.
 *
 * In order to override default settings, simply mirror them under `rnpm` key in your
 * package.json.
 *
 * In order to make `rnpm` ignore certain targets, simply set them to `false`. Otherwise,
 * there will be warnings.
 *
 * It optionally accepts packageName - when it's present, config will be loaded from node_modules/packageName
 */
module.exports = function getConfig(packageName) {
  const folder = packageName
    ? path.join(process.cwd(), 'node_modules', packageName)
    : process.cwd();

  const pjson = efs.requireFile(path.join(folder, './package.json'));

  if (!pjson) {
    return log.warn('EPACKAGEJSON', `Not found. Are you sure it's a React Native project?`);
  }

  const defaultConfig = {
    ios: getDefaultConfigIOS(folder, pjson),
    android: getDefaultConfigAndroid(folder, pjson),
  };

  return Object.assign({}, defaultConfig, pjson.rnpm);
};
