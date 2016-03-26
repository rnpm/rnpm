const glob = require('glob');
const path = require('path');

/**
 * Glob pattern to look for xcodeproj
 */
const GLOB_PATTERN = '**/*.xcodeproj';

/**
 * Regexp matching all test projects
 */
const TEST_PROJECTS = /(test|example)/;

/**
 * Base iOS folder
 */
const IOS_BASE = 'ios';

/**
 * These folders will be excluded from search to speed it up
 */
const GLOB_EXCLUDE_PATTERN = ['@(Pods|node_modules)/**'];

/**
 * Finds iOS project by looking for all .xcodeproj files
 * in given folder.
 *
 * Returns first match if files are found or null
 *
 * Note: `./ios/*.xcodeproj` are returned regardless of the name
 */
module.exports = function findProject(folder) {
  const projects = glob
    .sync(GLOB_PATTERN, {
      cwd: folder,
      ignore: GLOB_EXCLUDE_PATTERN,
    })
    .filter(project => {
      const xcPath = project.toLowerCase();
      return path.dirname(xcPath) === IOS_BASE || !xcPath.match(TEST_PROJECTS);
    });

  if (projects.length === 0) {
    return null;
  }

  return projects[0];
};
