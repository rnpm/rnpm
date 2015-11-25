const efs = require('../utils/fs');
const path = require('path');
const config = require('../config');
const log = require('npmlog');

const validateProjects = require('../plugins/validateProjects');
const registerDependencyAndroid = require('../android/registerNativeModule');
const registerDependencyIOS = require('../ios/registerNativeModule');

const getProjectDependencies = () => {
  const pjson = require(path.join(process.cwd(), './package.json'));
  return Object.keys(pjson.dependencies);
};

/**
 * Main action
 * See action description for further informations
 */
function updateProjects(args) {
  const project = config.getProjectConfig();

  if (!project) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const dependencies = args.packageName ? [args.packageName] : getProjectDependencies();

  if (!args.packageName) {
    log.info(`Found ${dependencies.length} native dependencies to link`);
  }

  dependencies
    .forEach(name => {
      const dependencyConfig = config.getDependencyConfig(name);

      // project is package.json.rnpm so you have `project.assets` here as well
      // if they were defined
      console.log(project.android);

      if (project.android && dependencyConfig.android) {
        log.info(`Linking ${name} android dependency`);
        registerDependencyAndroid(name, dependencyConfig.android, project.android);
      }

      if (project.ios && dependencyConfig.ios) {
        log.info(`Linking ${name} ios dependency`);
        registerDependencyIOS(name, dependencyConfig.ios, project.ios);
      }
    });
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  run: updateProjects,
};
