const fs = require('fs-extra');
const path = require('path');
const xml = require('xmldoc');
const compose = require('lodash.flowright');

const BASE_PATH = path.join(process.cwd(), 'android');

const manifest = fs.readFileSync(path.join(BASE_PATH, 'app', 'src', 'main', 'AndroidManifest.xml'));
const packageName = new xml.XmlDocument(manifest).attr.package.split('.')[1];

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;
const BUILD_GRADLE_PATH = path.join(BASE_PATH, 'app', 'build.gradle');
const SETTINGS_GRADLE_PATH = path.join(BASE_PATH, 'settings.gradle');
const ASSETS_PATH = path.join(BASE_PATH, 'app', 'src', 'main', 'assets');
const MAIN_ACTIVITY_PATH = path.join(BASE_PATH, 'app', 'src', 'main', 'java',
  'com', packageName, 'MainActivity.java');

const readFile = (file) =>
  () => fs.readFileSync(file, 'utf8');

const writeFile = (file, content) => content ?
  fs.writeFileSync(file, content, 'utf8') :
  (c) => fs.writeFileSync(file, c, 'utf8');

const replace = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

module.exports = function registerNativeAndroidModule(name) {
  const MODULE_DIR = path.join(process.cwd(), 'node_modules', name);
  const BUILD_PATCH = `    compile project(':${name}')`;
  const SETTINGS_PATCH = `include ':${name}'\n` +
    `project(':${name}').projectDir = ` +
    `new File(rootProject.projectDir, '../node_modules/${name}/android')`;

  const config = require(path.join(MODULE_DIR, 'package.json')).rnpm;

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
    replace(content, BUILD_PATCH_PATTERN, BUILD_PATCH);

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

  const applySettingsGradlePatch = compose(
    writeFile(SETTINGS_GRADLE_PATH),
    patchProjectSettings,
    readFile(SETTINGS_GRADLE_PATH)
  );

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

  /**
   * Copy assets from MODULE_DIR to ASSETS_PATH
   * @param  {Array} assets Array of assets specified in config
   * @return {Function}
   */
  const copyAssets = (assets) => {
    return () => (assets || []).forEach((asset) =>
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
      config.android.importPath,
      config.android.instance
    )
  )();
};
