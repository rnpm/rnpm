const path = require('path');
const flatten = require('lodash.flatten');
const pjson = require(path.join(process.cwd(), 'package.json'));

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
const defaultActions = Object.keys(
  require(path.join(__dirname, '..', 'package.json')).dependencies
).filter(isPlugin);

/**
 * Get plugin config
 * @param  {String} name Name of the plugin
 * @return {Object}      Plugin's config
 */
const getPluginConfig = (name) =>
  require(path.join(process.cwd(), 'node_modules', name));

/**
 * Compose a list of dependencies from default actions,
 * package's dependencies & devDependencies
 * @type {Array}
 */
const pluginsList = flatten([
  defaultActions,
  Object.keys(pjson.dependencies || []),
  Object.keys(pjson.devDependencies || []),
]);

module.exports = () =>
  pluginsList
    .filter(isPlugin)
    .map(getPluginConfig);
