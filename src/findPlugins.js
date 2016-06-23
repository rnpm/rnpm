const path = require('path');
const fs = require('fs');
const union = require('lodash').union;
const uniq = require('lodash').uniq;
const flatten = require('lodash').flatten;

/**
 * Filter dependencies by name pattern
 * @param  {String} dependency Name of the dependency
 * @return {Boolean}           If dependency is a rnpm plugin
 */
const isRNPMPlugin = (dependency) => !!~dependency.indexOf('rnpm-plugin-')
const isReactNativePlugin = (dependency) => !!~dependency.indexOf('react-native-');

const readPackage = (folder) => {
  try {
    return require(path.join(folder, 'package.json'));
  } catch (e) {
    return null;
  }
};

const findPluginsInReactNativePackage = (pjson) => {
  if (!pjson.rnpm || !pjson.rnpm.commands) {
    return [];
  }

  return path.join(pjson.name, pjson.rnpm.commands);
};

const findPluginInFolder = (folder) => {
  const pjson = readPackage(folder);

  if (!pjson) {
    return [];
  }

  const deps = union(
    Object.keys(pjson.dependencies || {}),
    Object.keys(pjson.devDependencies || {})
  );

  return deps.reduce(
    (acc, pkg) => {
      if (isRNPMPlugin(pkg)) {
        return acc.concat(pkg);
      }
      if (isReactNativePlugin(pkg)) {
        const pjson = readPackage(path.join(folder, 'node_modules', pkg));
        if (!pjson) {
          return acc;
        }
        return acc.concat(findPluginsInReactNativePackage(pjson));
      }
      return acc;
    },
    []
  );
};

/**
 * Find plugins in package.json of the given folder
 * @param {String} folder Path to the folder to get the package.json from
 * @type  {Array}         Array of plugins or an empty array if no package.json found
 */
module.exports = function findPlugins(folders) {
  return uniq(flatten(folders.map(findPluginInFolder)));
};
