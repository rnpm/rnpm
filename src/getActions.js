const path = require('path');
const flatten = require('lodash.flatten');

/**
 * Filter dependencies by name pattern
 * @param  {String} dependency Name of the dependency
 * @return {Boolean}           If dependency is a rnpm plugin
 */
const isPlugin = (dependency) => !!~dependency.indexOf('rnpm-plugin-');

/**
 * Get default actions from rnpm's package.json
 * @type {Array}
 */
const getActions = (cwd) => {
  const pjson = require(path.join(cwd, 'package.json'));
  return flatten(
      Object.keys(pjson.dependencies || {}),
      Object.keys(pjson.devDependencies || {})
    )
    .filter(isPlugin)
    .map(name => getPluginConfig(cwd, name));
};

/**
 * Get plugin config
 * @param  {String} name Name of the plugin
 * @return {Object}      Plugin's config
 */
const getPluginConfig = (cwd, name) =>
  require(path.join(cwd, 'node_modules', name));

/**
 * Compose a list of dependencies from default actions,
 * package's dependencies & devDependencies
 * @type {Array}
 */
const pluginsList = flatten([
  getActions(path.join(__dirname, '..')),
  getActions(process.cwd())
]);

module.exports = () => pluginsList;
