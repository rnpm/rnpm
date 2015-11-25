const path = require('path');
const fs = require('fs');
const efs = require('../utils/fs');
const glob = require('glob');

const GLOB_PATTERN = '**/*.xcodeproj';
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Examples/**', 'examples/**'];

exports.defaultProject = function defaultProjectIOS(folder) {
  var projects = glob.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN,
  });

  // No iOS support in this project
  if (projects.length === 0) {
    return false;
  }

  const project = path.join(folder, projects[0]);

  return {
    _src: path.dirname(project),
    _folder: folder,
    _pbxproj: path.join(project, 'project.pbxproj'),
    project: project,
    projectName: path.basename(project),
  };
};

exports.defaultDependency = exports.defaultProject;
