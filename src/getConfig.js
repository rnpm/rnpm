const log = require('npmlog');
const efs = require('./utils/fs');
const transform = require('lodash.transform');
const path = require('path');

const transformConfig = (config, folder) => transform(
  config,
  (platform, value, key) => {
    platform[key] = path.join(folder, value);
  }
);

/**
 * ResolvePaths takes config.ios/android and folder and returns object containing
 * absolute paths to the files and folders
 */
const resolvePaths = (config, folder) => ({
  ios: config.ios ? transformConfig(config.ios, folder) : null,
  android: config.android ? transformConfig(config.android, folder) : null,
});

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
    ios: {
      project: `./ios/${pjson.name}.xcodeproj`,
    },
    android: {
      project: './android/app/build.gradle',
      settings: './android/settings.gradle',
      assetsPath: './android/app/src/main/assets',
      mainActivity: `./android/app/src/main/java/com/${pjson.name}/MainActivity.java`,
    },
  };

  return resolvePaths(
    Object.assign({}, defaultConfig, pjson.rnpm),
    folder
  );
};
