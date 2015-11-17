var log = require('npmlog');

/**
 * Validates projects and prints warnings if there are any issues (side-effect).
 *
 * Projects that have no config supplied are ommited. Otherwise, they are added
 * to the accumulated value and return at the end of iteration.
 *
 * User might set config for a given platform to `false` to indicate that given
 * platform is not available (e.g {ios: false});
 *
 * If project has been created, it's being validated to check if any additional errors
 * are present (e.g. missing assets etc) that this package cannot fix. In such situation,
 * extra care by the application author has to be taken.
 */
function validateProjects(projects, config) {
  return Object.keys(projects).reduce((acc, platform) => {
    var project = projects[platform];

    if (!config[platform]) return acc;

    if (!project) {
      log.warn('ENOENT', `No project for ${platform} at ${config[platform].project}`);
      return acc;
    }

    var projectError = project.validate();
    if (projectError) {
      log.warn('EPROJECT', projectError);
      return acc;
    }

    return Object.assign({}, acc, { [platform]: project, });
  }, {});
}

module.exports = validateProjects;
