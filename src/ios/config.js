const path = require('path');
const fs = require('fs');
const efs = require('../utils/fs');
const glob = require('glob');

// Glob pattern to look for xcodeproj
const GLOB_PATTERN = '**/*.xcodeproj';

// These folders will be excluded from search to speed it up
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Examples/**', 'examples/**'];

/**
 * Finds iOS project by looking for all .xcodeproj files
 * in given folder.
 *
 * Returns first match if files are found or null
 */
const findProject = (folder) => {
  const projects = glob.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN,
  });

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
};

/**
 * Returns project config by analyzing given folder and applying some user defaults
 * when constructing final object
 */
exports.projectConfig = function projectConfigIOS(folder, userConfig) {
  const project = path.join(
    folder,
    userConfig.project || findProject(folder)
  );

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

exports.dependencyConfig = exports.projectConfig;
