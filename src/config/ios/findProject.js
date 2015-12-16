const glob = require('glob');

/**
 * Glob pattern to look for xcodeproj
 */
const GLOB_PATTERN = '**/*.xcodeproj';

/**
 * These folders will be excluded from search to speed it up
 */
const GLOB_EXCLUDE_PATTERN = ['node_modules/**', '**/@(E|e)xamples/**', '**/*@(T|t)est*/**', 'Pods/**'];

/**
 * Finds iOS project by looking for all .xcodeproj files
 * in given folder.
 *
 * Returns first match if files are found or null
 */
module.exports = function findProject(folder) {
  const projects = glob.sync(GLOB_PATTERN, {
    cwd: folder,
    ignore: GLOB_EXCLUDE_PATTERN,
  });

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
};
