const path = require('path');
const xml = require('xmldoc');
const fs = require('fs');
const efs = require('../utils/fs');

// Default android source directory to look for files
const BASE_DIR = './android';

/**
 * Gets default config from android project
 */
module.exports = function getDefaultConfigAndroid(folder, pjson) {
  var src = path.join(folder, BASE_DIR);

  // Some projects are placed under `app`
  // @todo use some `glob` pattern to indicate different settings
  if (fs.existsSync(path.join(src, 'app'))) {
    src = path.join(src, 'app');
  }

  const manifest = new xml.XmlDocument(
    efs.loadFile(path.join(src, 'src/main/AndroidManifest.xml'))
  );

  const packageName = manifest.attr.package;
  const packagePath = packageName.replace('.', '/');

  return {
    project: path.join(src, 'build.gradle'),
    settings: path.join(BASE_DIR, 'settings.gradle'),
    assetsFolder: path.join(src, 'src/main/res'),
    mainActivity: path.join(src, `src/main/java/${packagePath}/MainActivity.java`),
    packageImportPath: `${packageName}.Package`,
    packageInstance: `new ${packageName}()`,
  };
};
