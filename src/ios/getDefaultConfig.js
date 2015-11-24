const path = require('path');

module.exports = function getDefaultConfigIOS(folder, pjson) {
  return {
    project: path.join(folder, `./ios/${pjson.name}.xcodeproj`),
  };
};
