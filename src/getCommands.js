const path = require('path');
const fs = require('fs');
const uniq = require('lodash.uniq');
const flatten = require('lodash.flatten');
const findPlugins = require('./findPlugins');

/**
 * @return {Array} Array of commands
 */
module.exports = function getCommands() {
  const rnpmRoot = path.join(__dirname, '..');
  const appRoot = process.cwd();

  return uniq(
    flatten(findPlugins([rnpmRoot, appRoot]).map(require))
  , 'name');
};
