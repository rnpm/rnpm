const fs = require('fs-extra');
const path = require('path');
const xml = require('xmldoc');
const compose = require('lodash.flowright');

const SETTINGS_PATCH_PATTERN = `include ':app'`;
const BUILD_PATCH_PATTERN = `dependencies {`;
const MAIN_ACTIVITY_IMPORT_PATTERN = `import android.app.Activity;`;
const MAIN_ACTIVITY_PACKAGE_PATTERN = `.addPackage(new MainReactPackage())`;

const readFile = (file) =>
  () => fs.readFileSync(file, 'utf8');

const writeFile = (file, content) => content ?
  fs.writeFileSync(file, content, 'utf8') :
  (c) => fs.writeFileSync(file, c, 'utf8');

const replace = (scope, pattern, patch) =>
  scope.replace(pattern, `${pattern}\n${patch}`);

module.exports = function registerNativeAndroidModule(name, dependencyConfig, projectConfig) {
  console.log(dependencyConfig);
  console.log(projectConfig);
  const MODULE_DIR = path.join(process.cwd(), 'node_modules', name);
  const BUILD_PATCH = `    compile project(':${name}')`;
  const SETTINGS_PATCH = `include ':${name}'\n` +
    `project(':${name}').projectDir = ` +
    `new File(rootProject.projectDir, '../node_modules/${name}/android')`;

  const config = require(path.join(MODULE_DIR, 'package.json')).rnpm;

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
  const makeMainActivityPatcher = (content) =>
    replace(content,
      MAIN_ACTIVITY_IMPORT_PATTERN,
      dependencyConfig.packageImportPath) &&
    replace(content,
      MAIN_ACTIVITY_PACKAGE_PATTERN,
      `                .addPackage(${dependencyConfig.packageInstance})`
    );

  const applySettingsGradlePatch = compose(
    writeFile(projectConfig.settingsGradlePath),
    patchProjectSettings,
    readFile(projectConfig.settingsGradlePath)
  );

  const applyBuildGradlePatch = compose(
    writeFile(projectConfig.buildGradlePath),
    patchProjectBuild,
    readFile(projectConfig.buildGradlePath)
  );

  const applyMainActivityPatch = compose(
    writeFile(projectConfig.mainActivityPath),
    makeMainActivityPatcher,
    readFile(projectConfig.mainActivityPath)
  );

  compose(
    applySettingsGradlePatch,
    applyBuildGradlePatch,
    applyMainActivityPatch
  )();
};
