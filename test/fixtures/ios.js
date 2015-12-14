const fs = require('fs');
const path = require('path');

exports.valid = {
  'sampleProject.xcodeproj': {
    'project.pbxproj': fs.readFileSync(path.join(__dirname, './files/project.pbxproj')),
  },
};
