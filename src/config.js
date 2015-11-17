var log = require('npmlog');
var efs = require('./utils/fs');

/**
 * Loads config for `rnpm` to use by projects.
 *
 * The default settings are always synced up with the latest React Native folder
 * structure created by `react-native init <name>`.
 *
 * In order to override default settings, simply mirror them under `rnpm` key in your
 * package.json.
 *
 * In order to make `rnpm` ignore certain targets, simply set them to `false`. Otherwise,
 * there will be warnings.
 */
function loadConfig() {
  var pjson = efs.requireFile('./package.json');

  if (!pjson) {
    return log.warn('EPACKAGEJSON', `Not found. Are you sure it's a React Native project?`);
  }

  var defaultConfig = {
    name: pjson.name,
    ios: {
      project: `./ios/${pjson.name}/${pjson.name}.xcodeproj`
    },
    android: {
      project: `./android/app/build.gradle`
    }
  };

  return pjson.rnpm
    ? Object.assign({}, defaultConfig, pjson.rnpm)
    : defaultConfig;
}

module.exports = loadConfig;
