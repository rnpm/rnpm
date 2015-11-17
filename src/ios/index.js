var efs = require('../utils/fs');

/**
 * @constructor
 */
function ProjectIOS(project, config) {
  this._config = config;
}

/**
 * Factory to create iOS project from a given object
 *
 * See ../config.js for further details on config structure
 */
ProjectIOS.fromConfig = function fromConfig(config) {
  var project = efs.loadFile(config.project);
  return project ? new ProjectIOS(project, config) : null;
};

module.exports = ProjectIOS;
