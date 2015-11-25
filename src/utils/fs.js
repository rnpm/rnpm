var fs = require('fs');
var path = require('path');

/**
 * Tries to require given file in a try-catch block. If file is not present,
 * null value is returend allowing other methods to handle errors gracefuly.
 */
exports.requireFile = function requireFile(filePath) {
  try {
    return require(filePath);
  } catch (err) {
    return null;
  }
};

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
