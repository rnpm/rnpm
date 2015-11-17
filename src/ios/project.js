var efs = require('../utils/fs');

/**
 * @constructor
 */
function ProjectIOS(project, config) {
  this._config = config;
}

/**
 * Validates iOS project
 *
 * Returns an error if any of the configuration properties
 * supplied contain errors
 */
ProjectIOS.prototype.validate = function validateIOS() {
  return null;
}

/**
 * Factory to create iOS project from a given object
 *
 * See ../config.js for further details on config structure
 */
ProjectIOS.fromConfig = function(config) {
  var project = efs.loadFile(config.project);
  return project ? new ProjectIOS(project, config) : null;
}

module.exports = ProjectIOS;
