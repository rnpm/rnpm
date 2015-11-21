const fs = require('fs');

exports.readFile = (file) => () => fs.readFileSync(file, 'utf8');

exports.writeFile = (file, content) => content ?
  fs.writeFileSync(file, content, 'utf8') :
  (c) => fs.writeFileSync(file, c, 'utf8');

exports.replace = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

