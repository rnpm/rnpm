const path = require('path');
const pjson = require(path.join(process.cwd(), 'package.json'));

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
const getPluginConfig = (name) =>
  require(path.join(process.cwd(), 'node_modules', name, 'config.js'));

module.exports = () =>
  (pjson.devDependencies || [])
    .filter(isPlugin)
    .map(getPluginConfig);
