const path = require('path');
const fs = require('fs');
const flatten = require('lodash.flatten');
const union = require('lodash.union');
const uniq = require('lodash.uniq');

/**
 * Filter dependencies by name pattern
 * @param  {String} dependency Name of the dependency
 * @return {Boolean}           If dependency is a rnpm plugin
 */
const isPlugin = (dependency) => !!~dependency.indexOf('rnpm-plugin-');

/**
 * Get plugin config
 * @param  {String} name Name of the plugin
 * @return {Object}      Plugin's config
 */
const getPluginConfig = cwd => name =>
  require(path.join(cwd, 'node_modules', name));

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
  const deps = union(
    Object.keys(pjson.dependencies || {}),
    Object.keys(pjson.devDependencies || {})
  );

  return deps.filter(isPlugin).map(getPluginConfig(cwd));
};

/**
 * Compose a list of dependencies from
 * rnpm dependencies and current project dependencies
 * @type {Array}
 */
const actionsList = flatten([
  getActions(path.join(__dirname, '..')),
  getActions(process.cwd()),
]);

module.exports = uniq(actionsList, 'name');
