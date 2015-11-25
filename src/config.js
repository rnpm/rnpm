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

const fs = require('fs');
const path = require('path');

const androidConfig = require('./android/config');
const iosConfig = require('./ios/config');

/**
 * Gets rnpm config from reading it from JSON (for now)
 */
const getRNPMConfig = function getRNPMConfig(folder) {
  const pjsonPath = path.join(folder, './package.json');

  if (!fs.existsSync(pjsonPath)) {
    return null;
  }

  const pjson = require(pjsonPath);

  return pjson.rnpm || {};
};

/**
 * Returns project config for current working directory
 */
exports.getProjectConfig = function getProjectConfig() {
  const folder = process.cwd();
  const rnpm = getRNPMConfig(folder);

  if (!rnpm) {
    return null;
  }

  return Object.assign({}, rnpm, {
    ios: iosConfig.projectConfig(folder, rnpm.ios || {}),
    android: androidConfig.projectConfig(folder, rnpm.android || {}),
  });
};

/**
 * Returns dependency config for a dependency located under node_modules/<package_name>
 */
exports.getDependencyConfig = function getDependencyConfig(packageName) {
  const folder = path.join(process.cwd(), 'node_modules', packageName);
  const rnpm = getRNPMConfig(folder);

  if (!rnpm) {
    return null;
  }

  return Object.assign({}, rnpm, {
    ios: iosConfig.dependencyConfig(folder, rnpm.ios || {}),
    android: androidConfig.dependencyConfig(folder, rnpm.android || {}),
  });
};
