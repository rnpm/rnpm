const fs = require('fs-extra');
const path = require('path');
const compose = require('lodash.flowright');
const pjson = require('./package.json');

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

module.exports = function registerNativeAndroidModule(name) {
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

  const modulePackageContent = fs.readFileSync(
    path.join(MODULE_DIR, 'package.json'), 'utf8'
  );

  /**
   * Get config from package.json's content
   * @param  {String} content Content of package.json
   * @return {Object}         Module's rnpm config
   */
  const getConfig = (content) => JSON.parse(content).rnpm;

  const readFile = (file) => () => fs.readFileSync(file, 'utf8');
  const writeFile = (file, content) => content ?
    fs.writeFileSync(file, content, 'utf8') :
    (c) => fs.writeFileSync(file, c, 'utf8');
  const replace = (scope, pattern, patch) =>
    scope.replace(pattern, `${pattern}\n${patch}`);

  const writeSettingsGradle = (content) =>
    fs.writeFileSync(SETTINGS_GRADLE_PATH, content, 'utf8');
  const writeBuildGradle = (content) =>
    fs.writeFileSync(BUILD_GRADLE_PATH, content, 'utf8');

  const SETTINGS_PATCH = `include ':react-native-vector-icons'\n` +
    `project(':${name}').projectDir = new File(rootProject.projectDir, ` +
    `'../node_modules/${name}/android')\n`;

  const getBuildPatch = () => `    compile project(':${name}')`;

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
    replace(content, SETTINGS_PATCH_PATTERN, SETTINGS_PATCH);

  /**
   * Replace BUILD_PATCH_PATTERN by patch in the passed content
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  const patchProjectBuild = (content) =>
    replace(content, BUILD_PATCH_PATTERN, getBuildPatch);

  /**
   * Make a MainActivity.java program patcher
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const makeMainActivityPatcher = (importPath, instance) =>
    (content) =>
      replace(content, MAIN_ACTIVITY_IMPORT_PATTERN, getImportPatch(importPath)) &&
      replace(content, MAIN_ACTIVITY_PACKAGE_PATTERN, getPackagePatch(instance));

  /**
   * @return {Function}    Settings.gradle patcher
   */
  const applySettingsGradlePatch = compose(
    writeFile(SETTINGS_GRADLE_PATH),
    patchProjectSettings,
    readFile(SETTINGS_GRADLE_PATH)
  );

  /**
   * @return {Function}    Build.gradle patcher
   */
  const applyBuildGradlePatch = compose(
    writeFile(BUILD_GRADLE_PATH),
    patchProjectBuild,
    readFile(BUILD_GRADLE_PATH)
  );

  /**
   * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
   * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
   * @return {Function}            Patcher function
   */
  const applyMainActivityPatch = (importPath, instance) =>
    compose(
      writeFile(MAIN_ACTIVITY_PATH),
      makeMainActivityPatcher(importPath, instance),
      readFile(MAIN_ACTIVITY_PATH)
    );

  const copyAssets = (assets) => {
    if (!assets) assets = [];

    return () => assets.forEach((asset) =>
      fs.copySync(
        path.join(MODULE_DIR, asset),
        path.join(ASSETS_PATH, asset)
      )
    );
  };

  const config = getConfig(modulePackageContent);

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
