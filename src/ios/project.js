var efs = require('../utils/fs');

function ProjectIOS(project, config) {

}

ProjectIOS.fromConfig = function(config) {
  var project = efs.loadFile(config.project);
  return project ? new ProjectIOS(project, config) : null;
}

module.exports = ProjectIOS;
