/**
 * Config
 *
 * Loads config for `rnpm` to use by projects.
 *
 * In order to override default settings, simply mirror them under `rnpm` key in your
 * package.json.
 *
 * It optionally accepts packageName - when it's present, config will be loaded from node_modules/packageName
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const androidConfig = require('./android');
const iosConfig = require('./ios');

const getAssetsInFolder = (folder) =>
  glob.sync(path.join(folder, '**'), { nodir: true });

const findAssetsInFolders = (folders) =>
  (folders || [])
    .map(assetsFolder => path.join(folder, assetsFolder))
    .reduce((assets, assetsFolder) => {
      return assets.concat(getAssetsInFolder(assetsFolder));
    }, []);

/**
 * Utility function for those who want to avoid try/catch and Check
 * if package.json exists upfront.
 *
 * @Kureev reword, everybody wins
 */
exports.isValidProject = function isValidProject(folder) {
  return fs.existsSync(
    path.join(folder, './package.json')
  );
};

/**
 * Gets package.json from given folder
 *
 * Will throw an error if there's no package.json found
 */
const getPackage = exports.getPackage = function getPackage(folder) {
  return require(
    path.join(folder, './package.json')
  );
};

/**
 * Gets rnpm config from reading it from JSON (for now)
 *
 * This method is just here as a placeholder so that it's
 * easier for us in the future to change that behaviour
 * transparently
 *
 * If there's no `rnpm` config declared, we return an empty
 * object which for now is a placeholder to future optional
 * defaults.
 */
const getRNPMConfig = function getRNPMConfig(folder) {
  return getPackage(folder).rnpm || {};
};

/**
 * Returns project config for current working directory
 */
exports.getProjectConfig = function getProjectConfig() {
  const folder = process.cwd();
  const rnpm = getRNPMConfig(folder);

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

  return Object.assign({}, rnpm, {
    ios: iosConfig.dependencyConfig(folder, rnpm.ios || {}),
    android: androidConfig.dependencyConfig(folder, rnpm.android || {}),
    assets: findAssetsInFolders(rnpm.assets),
  });
};
