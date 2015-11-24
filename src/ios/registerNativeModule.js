const xcode = require('xcode');

const hasLibraryImported = (libraries, packageName) => {
  return libraries.children.filter(library => library.comment === packageName).length > 0;
}

module.exports = function registerNativeModuleIOS(name, dependencyConfig, projectConfig) {
  const project = xcode.project(projectConfig._pbxproj).parseSync();
  const dependencyProject = xcode.project(dependencyConfig._pbxproj).parseSync();
  const importedLibraries = project.pbxGroupByName('Libraries');

  if (hasLibraryImported(importedLibraries, dependencyConfig.projectName)) {
    return;
  }


};
