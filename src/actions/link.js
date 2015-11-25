const efs = require('../utils/fs');
const path = require('path');
const config = require('../config');
const log = require('npmlog');

const registerDependencyAndroid = require('../android/registerNativeModule');
const registerDependencyIOS = require('../ios/registerNativeModule');

/**
 * Returns an array of dependencies that should be linked/checked.
 */
const getProjectDependencies = () => {
  const pjson = require(path.join(process.cwd(), './package.json'));
  return Object.keys(pjson.dependencies).filter(name => name !== 'react-native');
};

/**
 * Updates project and linkes all dependencies to it
 *
 * If optional argument [packageName] is provided, it's the only one that's checked
 */
function link(packageName) {
  const project = config.getProjectConfig();

  if (!project) {
    log.error('ERRPACKAGEJSON', `No package found. Are you sure it's a React Native project?`);
    return;
  }

  const dependencies = packageName ? [packageName] : getProjectDependencies();

  if (!packageName) {
    log.info(`Found ${dependencies.length} native dependencies to link`);
  }

  dependencies
    .forEach(name => {
      const dependencyConfig = config.getDependencyConfig(name);

      if (!dependencyConfig) {
        return log.info(`Project ${name} is not a react-native library`);
      }

      if (project.android && dependencyConfig.android) {
        log.info(`Linking ${name} android dependency`);
        registerDependencyAndroid(name, dependencyConfig.android, project.android);
      }

      if (project.ios && dependencyConfig.ios) {
        log.info(`Linking ${name} ios dependency`);
        registerDependencyIOS(dependencyConfig.ios, project.ios);
      }

      if (dependencyConfig.assets) {
        // copy all dependencyConfig.assets to project.assetsFolder
      }
    });
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  run: link,
  args: [{
    name: 'packageName',
  }],
};
