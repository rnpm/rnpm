const path = require('path');
const xml = require('xmldoc');
const fs = require('fs');
const glob = require('glob');
const findAndroidAppFolder = require('./findAndroidAppFolder');
const findManifest = require('./findManifest');
const readManifest = require('./readManifest');
const findPackageClassName = require('./findPackageClassName');

const getPackageName = (manifest) => manifest.attr.package;

/**
 * Gets android project config by analyzing given folder and taking some
 * defaults specified by user into consideration
 */
exports.projectConfig = function projectConfigAndroid(folder, userConfig) {
  const manifestPath = findManifest(folder);
  const src = userConfig.sourceDir || findAndroidAppFolder(folder);

  if (!manifestPath || !src) {
    return null;
  }

  const manifest = readManifest(manifestPath);
  const sourceDir = path.join(folder, src);

  const packageName = userConfig.packageName || getPackageName(manifest);
  const packageFolder = userConfig.packageFolder ||
    packageName.replace('.', path.sep);

  const mainActivityPath = path.join(
    sourceDir,
    userConfig.mainActivityPath || `src/main/java/${packageFolder}/MainActivity.java`
  );

  const settingsGradlePath = path.join(
    folder,
    'android',
    userConfig.settingsGradlePath || 'settings.gradle'
  );

  const assetsPath = path.join(
    sourceDir,
    userConfig.assetsPath || 'src/main/assets'
  );

  const buildGradlePath = path.join(
    sourceDir,
    userConfig.buildGradlePath || 'build.gradle'
  );

  return {
    sourceDir,
    folder,
    buildGradlePath,
    settingsGradlePath,
    assetsPath,
    mainActivityPath,
  };
};

/**
 * Same as projectConfigAndroid except it returns
 * different config that applies to packages only
 */
exports.dependencyConfig = function dependencyConfigAndroid(folder, userConfig) {
  const manifestPath = findManifest(folder);
  const src = userConfig.sourceDir || findAndroidAppFolder(folder);

  if (!manifestPath || !src) {
    return null;
  }

  const manifest = readManifest(manifestPath);
  const sourceDir = path.join(folder, src);
  const packageName = userConfig.packageName || getPackageName(manifest);
  const packageClassName = findPackageClassName(sourceDir);

  /**
   * This module has no package to export
   */
  if (!packageClassName) {
    return null;
  }

  const packageImportPath = userConfig.packageImportPath ||
    `import ${packageName}.${packageClassName}`;

  const packageInstance = userConfig.packageInstance ||
    `new ${packageClassName}()`;

  return { sourceDir, folder, manifest, packageImportPath, packageInstance };
};
