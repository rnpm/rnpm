var android = require('../android/project');
var ios = require('../ios/project');
var loadConfig = require('../config');
var validateProjects = require('./validateProjects');

/*
 * Initialisation of the `rnpm` called before anything.
 * Sets up some basic loggers and loads projects to work with
 *
 * Returns object containing `ios` and `android` projects
 * that can be used later on to perform some platform-specific
 * tasks.
 *
 * Any invalid projects are omitted and deleted from the object
 * being returned. See `validateProjects` for further details.
 */
function initProjects() {
  var config = loadConfig();

  var projects = {
    ios: ios.fromConfig(config.ios),
    android: android.fromConfig(config.android)
  };

  return validateProjects(projects, config);
}

module.exports = initProjects;
