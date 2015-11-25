const path = require('path');
const xml = require('xmldoc');
const fs = require('fs');
const efs = require('../utils/fs');
const glob = require('glob');

// Default android source directory to look for files
const BASE_DIR = './android';
const GLOB_PATTERN = '**/*.java';

const getSourceDirectory = (folder) => {
  var src = BASE_DIR;

  if (!fs.existsSync(path.join(folder, src))) {
    return null;
  }

  if (fs.existsSync(path.join(folder, src, 'app'))) {
    src = path.join(src, 'app');
  }

  return src;
};

const getPackageName = (src) => {
  const manifest = new xml.XmlDocument(
    efs.loadFile(path.join(src, 'src/main/AndroidManifest.xml'))
  );

  return manifest.attr.package;
};

const getPackageFolder = (packageName) => packageName.replace('.', path.sep);

const getPackageInstance = (src) => {
  const files = glob.sync(GLOB_PATTERN, {
    cwd: src,
  });

  const packages = files
    .map(filePath => efs.loadFile(path.join(src, filePath)))
    .map(file => file.match(/class (.*) implements ReactPackage/))
    .filter(match => match);

  // No package exported, ignore
  if (packages.length === 0) {
    return null;
  }

  return packages[0][1];
};

exports.projectConfig = function projectConfigAndroid(folder, userConfig) {
  const src = path.join(folder, userConfig.sourceDir || getSourceDirectory(folder));

  if (!src) {
    return null;
  }

  const packageName = userConfig.packageName || getPackageName(src);
  const packageFolder = userConfig.packageFolder || getPackageFolder(packageName);

  return {
    src: src,
    folder: folder,
    project: path.join(src, userConfig.project || 'build.gradle'),
    settings: path.join(folder, BASE_DIR, userConfig.settings || 'settings.gradle'),
    mainActivity: path.join(src, userConfig.mainActivity || `src/main/java/${packageFolder}/MainActivity.java`),
  };
};

exports.dependencyConfig = function dependencyConfigAndroid(folder, userConfig) {
  const src = path.join(folder, userConfig.sourceDir || getSourceDirectory(folder));

  if (!src) {
    return null;
  }

  const packageName = userConfig.packageName || getPackageName(src);
  const packageInstance = userConfig.packageInstance || getPackageInstance(src);

  // This module has no package to export
  if (!packageInstance) {
    return null;
  }

  return {
    src: src,
    folder: folder,
    packageImportPath: `import ${packageName}.${packageInstance}`,
    packageInstance: `new ${packageInstance}()`,
  };
};
