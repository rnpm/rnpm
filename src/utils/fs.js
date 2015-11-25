var fs = require('fs');
var path = require('path');

exports.writeFile = function writeFile(filePath, contents) {
  return fs.writeFileSync(filePath, contents, 'utf8');
};

/**
 * Tries to load given file in a try-catch block. For the detailed behaviour,
 * see `requireFile` docs.
 */
exports.loadFile = function loadFile(filePath) {
  return fs.readFileSync(filePath, {encoding: 'utf8'});
};

/**
 * Returns an array of React Native dependencies, that is all npm packages
 * that are subject to this plugin
 */
exports.loadDependencies = function loadDependencies() {
  return [];
};
