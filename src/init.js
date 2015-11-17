var log = require('npmlog');
var android = require('./android/project');
var ios = require('./ios/project');
var loadConfig = require('./config');

// Load npmlog heading
log.heading = 'rnpm';

/**
 * Validates projects and prints warnings if there are any issues (side-effect).
 *
 * Projects that have no config supplied are ommited. Otherwise, they are added
 * to the accumulated value and return at the end of iteration.
 */
function validateProjects(projects, config) {
  return Object.keys(projects).reduce(function(acc, platform) {
    var project = projects[platform];

    if (!config[platform]) return acc;

    if (!project) {
      log.warn('ENOENT', `No project for ${platform} at ${config[platform].project}`);
      return acc;
    }

    var projectError = project.validate();
    if (projectError) {
      log.warn('EPROJECT', projectError);
      return acc;
    }

    return Object.assign({}, acc, {[platform]: project});
  }, {});
}

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
function init() {
  var config = loadConfig();

  var projects = {
    ios: ios.fromConfig(config.ios),
    android: android.fromConfig(config.android)
  };

  return validateProjects(projects, config);
}

module.exports = init;
