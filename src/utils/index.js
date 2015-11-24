const fs = require('fs');

exports.replace = function replacePattern(scope, pattern, patch) {
  return scope.replace(pattern, `${pattern}\n${patch}`);
};
