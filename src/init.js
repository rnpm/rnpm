var log = require('npmlog');
var android = require('./android/project');
var ios = require('./ios/project');
var loadConfig = require('./config');

// Load npmlog heading
log.heading = 'rnpm';

/**
 * Validates projects and prints warnings if there are any issues.
 *
 * Projects that have no config supplied are ommited.
 */
function validateProjects(projects, config) {
  Object.keys(projects).forEach(function(platform) {
    var project = projects[platform];

    if (!config[platform]) return;

    if (!project) {
      return log.warn('ENOENT', `No project for ${platform} at ${config[platform].project}`);
    }

    var projectError = project.validate();
    if (projectError) {
      log.warn('EPROJECT', projectError);
    }
  });
}

/*
 * Initialisation of the `rnpm` called before anything.
 * Sets up some basic loggers and loads projects to work with
 *
 * Returns object containing `ios` and `android` projects
 * that can be used later on to perform some platform-specific
 * tasks
 */
function init() {
  var config = loadConfig();

  var projects = {
    ios: ios.fromConfig(config.ios),
    android: android.fromConfig(config.android)
  };

  validateProjects(projects, config);

  return projects;
}

module.exports = init;
