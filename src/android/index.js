const fs = require('fs-extra');
const path = require('path');
const compose = require('lodash.flowright');

const BUILD_GRADLE_PATH = path.join(
  process.cwd(), 'android', 'app', 'build.gradle'
);

const SETTINGS_GRADLE_PATH = path.join(
  process.cwd(), 'android', 'settings.gradle'
);

const ASSETS_PATH = path.join(
  process.cwd(), 'android', 'app', 'src', 'main', 'assets'
);

const composeMainActivityPath = (name) => path.join(
  process.cwd(), 'android', 'app', 'src', 'main',
  'java', 'com', name, 'MainActivity.java'
);

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

/**
 * Get module dir
 * @param  {String} name Name of the module
 * @return {String}      Path to the module inside node_modules folder
 */
const getModuleDir = (name) =>
  path.join(process.cwd(), 'node_modules', name);

/**
 * Get module's package.json content
 * @param  {String} name Name of the module
 * @return {Object}      Content of module's package.json
 */
const getModulePackage = (name) =>
  fs.readFileSync(path.join(getModuleDir(name), 'package.json'), 'utf8');

/**
 * Get config from package.json's content
 * @param  {String} content Content of package.json
 * @return {Object}         Module's rnpm config
 */
const getConfig = (content) => JSON.parse(content).rnpm;

/**
 * @param  {String} Name of the module
 * @return {Object} Android config for processing module
 */
const getModuleAndroidConfig = compose(
  (c) => c.android, getConfig, getModulePackage
);

const readFile = (file) => () => fs.readFileSync(file, 'utf8');
const writeFile = (file, content) => {
  if (content) {
    return fs.writeFileSync(file, content, 'utf8');
  }

  return (c) => fs.writeFileSync(file, c, 'utf8');
};

const writeSettingsGradle = (content) =>
  fs.writeFileSync(SETTINGS_GRADLE_PATH, content, 'utf8');
const writeBuildGradle = (content) =>
  fs.writeFileSync(BUILD_GRADLE_PATH, content, 'utf8');

const replace = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

const getSettingsPatch = (name) =>
  `include ':react-native-vector-icons'\n` +
  `project(':${name}').projectDir = ` +
    `new File(rootProject.projectDir, '../node_modules/${name}/android')\n`;

const getBuildPatch = (name) =>
  `    compile project(':${name}')`;

const getImportPatch = (importPath) =>
  `import ${importPath}`;

const getPackagePatch = (instance) =>
  `                .addPackage(${instance})`;

/**
 * Make a project settings patcher
 * @param  {String}   name Name of the project we're going to include
 * @return {Function}      Patcher function
 */
const makeProjectSettingsPatcher = (name) =>
  /**
   * Replace SETTINGS_PATCH_PATTERN by patch in the passed content
   * @param  {String} content Content of the Settings.gradle file
   * @return {String}         Patched content of Settings.gradle
   */
  (content) => replace(content, SETTINGS_PATCH_PATTERN, getSettingsPatch(name));

/**
 * Make a project settings patcher
 * @param  {String}   name Name of the project we're going to include
 * @return {Function}      Patcher function
 */
const makeProjectBuildPatcher = (name) =>
  /**
   * Replace BUILD_PATCH_PATTERN by patch in the passed content
   * @param  {String} content Content of the Build.gradle file
   * @return {String}         Patched content of Build.gradle
   */
  (content) => replace(content, BUILD_PATCH_PATTERN, getBuildPatch(name));

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
 * @param  {String} name Name of the project we're going to include
 * @return {Function}    Settings.gradle patcher
 */
const applySettingsGradlePatch = (name) =>
  compose(
    writeFile(SETTINGS_GRADLE_PATH),
    makeProjectSettingsPatcher(name),
    readFile(SETTINGS_GRADLE_PATH)
  );

/**
 * @param  {String} name Name of the project we're going to include
 * @return {Function}    Build.gradle patcher
 */
const applyBuildGradlePatch = (name) =>
  compose(
    writeFile(BUILD_GRADLE_PATH),
    makeProjectBuildPatcher(name),
    readFile(BUILD_GRADLE_PATH)
  );

/**
 * @param  {String}   importPath Import path, e.g. com.oblador.vectoricons.VectorIconsPackage;
 * @param  {String}   instance   Code to instance a package, e.g. new VectorIconsPackage();
 * @return {Function}            Patcher function
 */
const applyMainActivityPatch = (name, importPath, instance) => {
  const mainActivityPath = composeMainActivityPath(name);

  return compose(
    writeFile(mainActivityPath),
    makeMainActivityPatcher(importPath, instance),
    readFile(mainActivityPath)
  );
};

const copyAssets = (name, assets) => {
  if (!assets) assets = [];

  return () => assets.forEach((asset) =>
    fs.copySync(
      path.join(getModuleDir(name), asset),
      path.join(ASSETS_PATH, asset)
    )
  );
};

module.exports = function registerNativeAndroidModule(name) {
  const config = compose(getConfig, getModulePackage)(name);
  const pjson = require('./package.json');

  compose(
    copyAssets(name, config.assets),
    applySettingsGradlePatch(name),
    applyBuildGradlePatch(name),
    applyMainActivityPatch(
      pjson.name,
      config.android.importPath,
      config.android.instance
    )
  )();
};
