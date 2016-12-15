const path = require('path');

const android = require('./android');
const ios = require('./ios');
const findAssets = require('./findAssets');
const wrapCommands = require('./wrapCommands');

const getRNPMConfig = (folder) =>
  require(path.join(folder, './package.json')).rnpm || {};
  
const getReactNativeVersion = (folder) =>
  require(path.join(folder, './node_modules/react-native/package.json')).version;

/**
 * Returns project config from the current working directory
 * @return {Object}
 */
exports.getProjectConfig = function getProjectConfig() {
  const folder = process.cwd();
  const rnpm = getRNPMConfig(folder);

  return Object.assign({}, rnpm, {
    ios: ios.projectConfig(folder, rnpm.ios || {}),
    android: android.projectConfig(folder, rnpm.android || {}),
    assets: findAssets(folder, rnpm.assets),
    rnVersion: getReactNativeVersion(folder),
  });
};

/**
 * Returns a dependency config from node_modules/<package_name>
 * @param {String} packageName Dependency name
 * @return {Object}
 */
exports.getDependencyConfig = function getDependencyConfig(packageName) {
  const folder = path.join(process.cwd(), 'node_modules', packageName);
  var rnpm;

  // Will throw when package.json is not present in a nested folder
  try {
    rnpm = getRNPMConfig(folder);
  } catch (err) {
    rnpm = {};
  }

  return Object.assign({}, rnpm, {
    ios: ios.dependencyConfig(folder, rnpm.ios || {}),
    android: android.dependencyConfig(folder, rnpm.android || {}),
    assets: findAssets(folder, rnpm.assets),
    commands: wrapCommands(rnpm.commands),
    params: rnpm.params || [],
  });
};
