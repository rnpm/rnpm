const path = require('path');
const fs = require('fs');
const flatten = require('lodash.flatten');

/**
 * Filter dependencies by name pattern
 * @param  {String} dependency Name of the dependency
 * @return {Boolean}           If dependency is a rnpm plugin
 */
const isPlugin = (dependency) => !!~dependency.indexOf('rnpm-plugin-');

/**
 * Gets actions from package.json in the cwd given
 * @param {String} cwd Path to the folder to get the package.json from
 * @type  {Array}      Array of actions or an empty array if no package.json found
 */
const getActions = (cwd) => {
  const packagePath = path.join(cwd, 'package.json');

  if (!fs.existsSync(packagePath)) {
    return [];
  }

  const pjson = require(packagePath);

  return flatten(
      Object.keys(pjson.dependencies || {}),
      Object.keys(pjson.devDependencies || {})
    )
    .filter(isPlugin)
    .map(getPluginConfig(cwd));
};

/**
 * Get plugin config
 * @param  {String} name Name of the plugin
 * @return {Object}      Plugin's config
 */
const getPluginConfig = cwd => name =>
  require(path.join(cwd, 'node_modules', name));

/**
 * Compose a list of dependencies from
 * rnpm dependencies and current project dependencies
 * @type {Array}
 */
const pluginsList = flatten([
  getActions(path.join(__dirname, '..')),
  getActions(process.cwd())
]);

module.exports = () => pluginsList;
