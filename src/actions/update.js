const efs = require('../utils/fs');
const path = require('path');
const config = require('../config');
const log = require('npmlog');

const validateProjects = require('../plugins/validateProjects');
const registerDependencyAndroid = require('../android/registerNativeModule');
const registerDependencyIOS = require('../ios/registerNativeModule');

/**
 * Main action
 * See action description for further informations
 */
function updateProjects(projects, args) {
  const pjson = require(path.join(process.cwd(), './package.json'));

  const dependencies = args.packageName
    ? [args.packageName]
    : Object.keys(pjson.dependencies);

  if (!args.packageName) {
    log.info(`Found ${dependencies.length} native dependencies to link`);
  }

  const errors = validateProjects(projects);
  if (errors.length > 0) {
    return errors.forEach(err =>
      log.error(err.code, err.msg)
    );
  }

  dependencies
    .forEach(name => {
      const dependencyConfig = config.getDependencyConfig(name);

      // if (projects.android && dependencyConfig.android) {
      //   log.info(`Linking ${name} android dependency`);
      //   registerDependencyAndroid(name, dependencyConfig.android, projects.android);
      // }

      if (projects.ios && dependencyConfig.ios) {
        log.info(`Linking ${name} ios dependency`);
        registerDependencyIOS(name, dependencyConfig.ios, projects.ios);
      }
    });
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  run: updateProjects,
};
