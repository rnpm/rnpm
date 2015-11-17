var android = require('./android/project');
var ios = require('./ios/project');
var loadConfig = require('./config');
var log = require('npmlog');

log.heading = 'rnpm';

function init() {
  var config = loadConfig();

  var projects = {
    ios: ios.fromConfig(config.ios),
    android: android.fromConfig(config.android)
  };

  Object.keys(projects).forEach(function(platform) {
    if (!projects[platform] && config[platform]) {
      log.warn('ENOENT', `No project for ${platform} at ${config[platform].project}`);
    }
  });
}

module.exports = init;

init();
