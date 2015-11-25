const path = require('path');
const fs = require('fs');
const efs = require('../utils/fs');
const glob = require('glob');

const GLOB_PATTERN = '**/*.xcodeproj';
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Examples/**', 'examples/**'];

const findProject = (folder) => {
  var projects = glob.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN,
  });

  if (projects.length === 0) {
    return null;
  }

  return path.join(folder, projects[0]);
};

exports.defaultProject = function defaultProjectIOS(folder, userConfig) {
  const project = userConfig.project || findProject(folder);

  // No iOS stuff found here
  if (!project) {
    return null;
  }

  return {
    src: path.dirname(project),
    folder: folder,
    pbxproj: path.join(project, 'project.pbxproj'),
    project: project,
    projectName: path.basename(project),
  };
};

exports.defaultDependency = exports.defaultProject;
