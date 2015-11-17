var efs = require('../utils/fs');

function ProjectAndroid(project, config) {

}

ProjectAndroid.fromConfig = function(config) {
  var project = efs.loadFile(config.project);
  return project ? new ProjectAndroid(project, config) : null;
}

ProjectAndroid.prototype.validate = function validateAndroid() {
  return null;
}

module.exports = ProjectAndroid;
