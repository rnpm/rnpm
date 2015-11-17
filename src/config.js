var fs = require('fs');
var path = require('path');

function _loadPackage() {
  try {
    return require(path.join(process.cwd(), 'package.json'));
  } catch(err) {
    return;
  }
}

/**
 * Loads config for `rnpm` to use by projects.
 *
 * The default settings are always synced up with the latest React Native folder
 * structure created by `react-native init <name>`.
 *
 * In order to override default settings, simply mirror them under `rnpm` key in your
 * package.json.
 */
function loadConfig() {
  var pjson = _loadPackage();

  if (!pjson) {
    return console.log(`Package.json not found. Are you sure it's a React Native project?`);
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
