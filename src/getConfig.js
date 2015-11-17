const log = require('npmlog');
const fs = require('fs');

/**
 * Loads config for `rnpm` to use by projects.
 *
 * In order to override default settings, simply mirror them under `rnpm` key in your
 * package.json.
 *
 * In order to make `rnpm` ignore certain targets, simply set them to `false`. Otherwise,
 * there will be warnings.
 */
module.exports = () => {
  var pjson = require('../package.json');

  if (!pjson) {
    return log.warn('EPACKAGEJSON', `Not found. Are you sure it's a React Native project?`);
  }

  var defaultConfig = {
    ios: {
      project: `./ios/${pjson.name}.xcodeproj`,
    },
    android: {
      project: './android/app/build.gradle',
    },
  };

  return pjson.rnpm
    ? Object.assign({}, defaultConfig, pjson.rnpm)
    : defaultConfig;
};
