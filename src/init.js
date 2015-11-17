var android = require('./android/project');
var ios = require('./ios/project');
var loadConfig = require('./config');

function init() {
  var config = loadConfig();

  var projects = {
    ios: ios.fromConfig(config.ios),
    android: android.fromConfig(config.android)
  };

  Object.keys(projects).forEach(function(platform) {
    if (!projects[platform] && config[platform]) {
      console.log(`No project found for ${platform}. If you are sure it's there, try setting `
        + `alternative config for rnpm. If you do not support ${platform} in your current `
        + `project, you can supress this warning by setting ${platform}:false in your `
        + `package.json`);
    }
  });
}

module.exports = init;

init();
