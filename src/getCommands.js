const path = require('path');
const fs = require('fs');
const flatten = require('lodash.flatten');
const uniq = require('lodash.uniq');
const findPlugins = require('./findPlugins');

/**
 * Get plugin commands
 * @param  {String}       name Name of the plugin
 * @return {Array|Object}      Plugin's commands
 */
const getPluginCommands = cwd => name => {
  const nested = path.join(cwd, 'node_modules', name);
  
  /* For rnpm installed locally with flat dependencies structure */
  const flat = path.join(cwd, '..', name);
  
  return require(fs.existsSync(nested) ? nested : flat); 
}

/**
 * @return {Array} Array of commands
 */
module.exports = function getCommands() {
  const rnpmRoot = path.join(__dirname, '..');
  const appRoot = process.cwd();

  const pluginsList = flatten([
    findPlugins(rnpmRoot).map(getPluginCommands(rnpmRoot)),
    findPlugins(appRoot).map(getPluginCommands(appRoot)),
  ], true);

  return uniq(pluginsList, 'name');
};
