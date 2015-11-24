const path = require('path');
const fs = require('fs');
const efs = require('../utils/fs');
const glob = require('glob');

const GLOB_PATTERN = '**/*.xcodeproj';
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', 'Examples/**', 'examples/**'];

/**
 * Gets default config from android project
 */
module.exports = function getDefaultConfigAndroid(folder, pjson) {
  var projects = glob.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN
  });

  // No iOS support in this project
  if (projects.length === 0) {
    return false;
  }

  const project = projects[0];
  const src = path.dirname(project);

  return {
    _src: src,
    _folder: folder,
    project: project
  };
};
