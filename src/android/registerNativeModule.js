const fs = require('fs-extra');
const efs = require('../utils/fs');
const path = require('path');
const compose = require('lodash.flowright');
const utils = require('../utils');

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

/**
 * Given package name, returns Java import declaration to be
 * inserted in the file
 */
const getImportPatch = (importPath) => `import ${importPath}`;

/**
 * Given package initialisation, returns Java .addPackage function call
 * to be attached in the MainActivity.java
 */
const getPackagePatch = (instance) => `                .addPackage(${instance})`;

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const buildPatch = `    compile project(':${name}')`;
  const settingsPatch = `include ':${name}'
project(':${name}').projectDir = new File(rootProject.projectDir, \
'../node_modules/${name}/android')`;

  // Replace SETTINGS_PATCH_PATTERN by patch in the passed content
  const patchProjectSettings = (content) =>
    utils.replace(content, SETTINGS_PATCH_PATTERN, settingsPatch);

  // Replace BUILD_PATCH_PATTERN by patch in the passed content
  const patchProjectBuild = (content) =>
    utils.replace(content, BUILD_PATCH_PATTERN, buildPatch);

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const makeMainActivityPatcher = (importPath, instance) =>
    (content) =>
      utils.replace(content, MAIN_ACTIVITY_IMPORT_PATTERN, getImportPatch(importPath)) &&
      utils.replace(content, MAIN_ACTIVITY_PACKAGE_PATTERN, getPackagePatch(instance));

  /**
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const applyMainActivityPatch = (importPath, instance) =>
    compose(
      efs.writeFile.bind(null, projectConfig.mainActivity),
      makeMainActivityPatcher(importPath, instance),
      efs.loadFile.bind(null, projectConfig.mainActivity)
    );

  // Copy assets from dependencyConfig.folder to projectConfig.assetsFolder
  const copyAssets = (assets) => {
    return () => (assets || []).forEach((asset) =>
      fs.copySync(
        path.join(dependencyConfig._folder, asset),
        path.join(projectConfig.assetsFolder, asset)
      )
    );
  };

  const applySettingsGradlePatch = compose(
    efs.writeFile.bind(null, projectConfig.settings),
    patchProjectSettings,
    efs.loadFile.bind(null, projectConfig.settings)
  );

  const applyBuildGradlePatch = compose(
    efs.writeFile.bind(null, projectConfig.project),
    patchProjectBuild,
    efs.loadFile.bind(null, projectConfig.project)
  );

  compose(
    copyAssets(dependencyConfig.assets),
    applySettingsGradlePatch,
    applyBuildGradlePatch,
    applyMainActivityPatch(
      dependencyConfig.packageImportPath,
      dependencyConfig.packageInstance
    )
  )();
};
