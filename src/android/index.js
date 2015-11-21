const fs = require('fs-extra');
const path = require('path');
const compose = require('lodash.flowright');
const utils = require('../utils');

const pjson = require(path.join(process.cwd(), 'package.json'));

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

module.exports = function registerNativeAndroidModule(name, config) {
  const BUILD_GRADLE_PATH = path.join(
    process.cwd(), 'android', 'app', 'build.gradle');

  const MODULE_DIR = path.join(
    process.cwd(), 'node_modules', name);

  const SETTINGS_GRADLE_PATH = path.join(
    process.cwd(), 'android', 'settings.gradle');

  const ASSETS_PATH = path.join(
    process.cwd(), 'android', 'app', 'src', 'main', 'assets');

  const MAIN_ACTIVITY_PATH = path.join(
    process.cwd(), 'android', 'app', 'src', 'main',
    'java', 'com', pjson.name, 'MainActivity.java'
  );

  const BUILD_PATCH = `    compile project(':${name}')`;
  const SETTINGS_PATCH = `include ':${name}'
project(':${name}').projectDir = new File(rootProject.projectDir, \
'../node_modules/${name}/android')`;

  const getImportPatch = (importPath) =>
    `import ${importPath}`;

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

  const applySettingsGradlePatch = compose(
    utils.writeFile(SETTINGS_GRADLE_PATH),
    patchProjectSettings,
    utils.readFile(SETTINGS_GRADLE_PATH)
  );

  const applyBuildGradlePatch = compose(
    utils.writeFile(BUILD_GRADLE_PATH),
    patchProjectBuild,
    utils.readFile(BUILD_GRADLE_PATH)
  );

  /**
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const applyMainActivityPatch = (importPath, instance) =>
    compose(
      utils.writeFile(MAIN_ACTIVITY_PATH),
      makeMainActivityPatcher(importPath, instance),
      utils.readFile(MAIN_ACTIVITY_PATH)
    );

  /**
   * Copy assets from MODULE_DIR to ASSETS_PATH
   * @param  {Array} assets Array of assets specified in config
   * @return {Function}
   */
  const copyAssets = (assets) => {
    if (!assets) assets = [];

    return () => assets.forEach((asset) =>
      fs.copySync(
        path.join(MODULE_DIR, asset),
        path.join(ASSETS_PATH, asset)
      )
    );
  };

  compose(
    copyAssets(config.assets),
    applySettingsGradlePatch,
    applyBuildGradlePatch,
    applyMainActivityPatch(
      pjson.name,
      config.android.importPath,
      config.android.instance
    )
  )();
};
