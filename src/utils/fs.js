var fs = require('fs');
var path = require('path');

exports.loadFile = function loadFile(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), filePath));
  } catch(err) {
    return;
  }
}

exports.requireFile = function requireFile(filePath) {
  try {
    return require(path.join(process.cwd(), filePath));
  } catch(err) {
    return;
  }
}
