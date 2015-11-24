const fs = require('fs-extra');
const efs = require('../utils/fs');
const path = require('path');
const compose = require('lodash.flowright');
const utils = require('../utils');

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  const MODULE_DIR = path.join(process.cwd(), 'node_modules', name);

  const BUILD_PATCH = `    compile project(':${name}')`;
  const SETTINGS_PATCH = `include ':${name}'
project(':${name}').projectDir = new File(rootProject.projectDir, \
'../node_modules/${name}/android')`;

  const getImportPatch = (importPath) => `import ${importPath}`;

  const getPackagePatch = (instance) =>
    `                .addPackage(${instance})`;

  /**
   * Replace SETTINGS_PATCH_PATTERN by patch in the passed content
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  const patchProjectSettings = (content) =>
    utils.replace(content, SETTINGS_PATCH_PATTERN, SETTINGS_PATCH);

  /**
   * Replace BUILD_PATCH_PATTERN by patch in the passed content
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  const patchProjectBuild = (content) =>
    utils.replace(content, BUILD_PATCH_PATTERN, BUILD_PATCH);

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

  /**
   * Copy assets from MODULE_DIR to config.android.assets
   * @param  {Array} assets Array of assets specified in config
   * @return {Function}
   */
  const copyAssets = (assets) => {
    return () => (assets || []).forEach((asset) =>
      fs.copySync(
        path.join(MODULE_DIR, asset),
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
      dependencyConfig.importPath,
      dependencyConfig.instance
    )
  )();
};
