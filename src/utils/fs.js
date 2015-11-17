var fs = require('fs');
var path = require('path');

/**
 * Tries to require given file in a try-catch block. If file is not present,
 * null value is returend allowing other methods to handle errors gracefuly.
 */
exports.requireFile = function requireFile(filePath) {
  try {
    return require(path.join(process.cwd(), filePath));
  } catch(err) {
    return null;
  }
}

/**
 * Tries to load given file in a try-catch block. For the detailed behaviour,
 * see `requireFile` docs.
 */
exports.loadFile = function loadFile(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath), {encoding: 'utf8'});
  } catch(err) {
    return null;
  }
}

/**
 * Returns an array of React Native dependencies, that is all npm packages
 * that are subject to this plugin
 */
exports.loadDependencies = function loadDependencies() {
 return [];
}
