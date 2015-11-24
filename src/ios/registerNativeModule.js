const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const pbxFile = require('xcode/lib/pbxFile');

const BACKUP_PATH = '/tmp';

const hasLibraryImported = (libraries, packageName) => {
  return libraries.children.filter(library => library.comment === packageName).length > 0;
};

const backupProject = (project, name) => {
  fs.writeFileSync(path.join(BACKUP_PATH, name), project.writeSync());
}

const getProducts = (project) => {
  return project
    .pbxGroupByName('Products')
    .children
    .map(c => c.comment)
    .filter(c => c.indexOf('.a') > -1);
}

const getRelativePath = (dependencyProject, project) => {

}

module.exports = function registerNativeModuleIOS(name, dependencyConfig, projectConfig) {
  const project = xcode.project(projectConfig._pbxproj).parseSync();
  const dependencyProject = xcode.project(dependencyConfig._pbxproj).parseSync();
  const importedLibraries = project.pbxGroupByName('Libraries');

  if (hasLibraryImported(importedLibraries, dependencyConfig.projectName)) {
    return;
  }

  console.log(project.pbxGroupByName('FileReferences'))

  backupProject(project, projectConfig.projectName);

  const products = getProducts(dependencyProject);

  console.log()

  // var file = new pbxFile(getRelativePath(dependency));

  // file.uuid = parsedTarget.generateUuid();
  // file.fileRef = parsedTarget.generateUuid();
  //
  // parsedTarget.addToPbxFileReferenceSection(file);    // PBXFileReference
  // pbxGroup.children.push(pbxGroupChild(file));
  // products.forEach(p => parsedTarget.addStaticLibrary(p));
  // products.forEach(p => parsedTarget.addToPbxBuildFileSection(new pbxFile(p))); // why add this
  // fs.writeFileSync(targetProjectPath, parsedTarget.writeSync());
  // return true;

};
