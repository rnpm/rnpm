const path = require('path');
const fs = require('fs');
const union = require('lodash.union');

/**
 * Filter dependencies by name pattern
 * @param  {String} dependency Name of the dependency
 * @return {Boolean}           If dependency is a rnpm plugin
 */
const isPlugin = (dependency) => !!~dependency.indexOf('rnpm-plugin-');

/**
 * Find plugins in package.json of the given folder
 * @param {String} folder Path to the folder to get the package.json from
 * @type  {Array}         Array of plugins or an empty array if no package.json found
 */
module.exports = function findPlugins(folder) {
  try {
    const pjson = require(path.join(folder, 'package.json'));
  } catch (e) {
    return [];
  }

  const deps = union(
    Object.keys(pjson.dependencies || {}),
    Object.keys(pjson.devDependencies || {})
  );

  return deps.filter(isPlugin);
};
