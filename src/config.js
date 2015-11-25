/**
 * Config
 *
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

const log = require('npmlog');
const efs = require('./utils/fs');
const transform = require('lodash.transform');
const path = require('path');

const androidConfig = require('./android/defaultConfig');
const iosConfig = require('./ios/defaultConfig');

/**
 * Returns project config for current working directory
 */
exports.getProjectConfig = function getProjectConfig() {
  const folder = process.cwd();
  const pjson = efs.requireFile(path.join(folder, './package.json'));

  if (!pjson) {
    return log.warn('EPACKAGEJSON', `Not found. Are you sure it's a React Native project?`);
  }

  const defaultConfig = {
    ios: iosConfig.defaultProject(folder),
    android: androidConfig.defaultProject(folder),
  };

  return Object.assign({}, defaultConfig, pjson.rnpm);
};

/**
 * Returns dependency config for a dependency located under node_modules/<package_name>
 */
exports.getDependencyConfig = function getDependencyConfig(packageName) {
  const folder = path.join(process.cwd(), 'node_modules', packageName);
  const pjson = efs.requireFile(path.join(folder, './package.json'));

  if (!pjson) {
    return log.warn('EPACKAGEJSON', `Not found for dependency ${packageName}. Run npm prune to fix this issue.`);
  }

  const defaultConfig = {
    ios: iosConfig.defaultDependency(folder),
    android: androidConfig.defaultDependency(folder),
  };

  return Object.assign({}, defaultConfig, pjson.rnpm);
};
