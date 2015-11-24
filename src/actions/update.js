const fs = require('fs');
const path = require('path');
const getConfig = require('../getConfig');
const log = require('npmlog');

const validateProjects = require('../plugins/validateProjects');
const registerDependencyAndroid = require('../android/registerNativeModule');

/**
 * Finds native dependencies located in the node_modules directory
 *
 * All modules that do not start with `react-native-` are discarded.
 */
const findNativeDependencies = () => fs
  .readdirSync(path.join('.', 'node_modules'))
  .map(depPath => path.basename(depPath))
  .filter(depPath => depPath.indexOf('react-native-') === 0);

/**
 * Main action
 * See action description for further informations
 */
function updateProjects(cli, args) {
  const dependencies = args.packageName
    ? [args.packageName]
    : findNativeDependencies();

  if (!args.packageName) {
    log.info(`Found ${dependencies.length} native dependencies to link`);
  }

  const errors = validateProjects(cli.config);
  if (errors.length > 0) {
    return errors.forEach(err =>
      log.error(err.code, err.msg)
    );
  }

  dependencies
    .forEach(name => {
      const dependencyConfig = getConfig(name);

      if (cli.config.android) {
        log.info(`Linking ${name} android dependency`);
        registerDependencyAndroid(name, dependencyConfig.android, cli.config.android);
      }
    });
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  run: updateProjects,
  args: [{
    name: 'packageName',
  }],
};
