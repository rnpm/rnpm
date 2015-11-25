const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const PbxFile = require('xcode/lib/pbxFile');

const hasLibraryImported = (libraries, packageName) => {
  return libraries.children.filter(library => library.comment === packageName).length > 0;
};

const getProducts = (project) => {
  return project
    .pbxGroupByName('Products')
    .children
    .map(c => c.comment)
    .filter(c => c.indexOf('.a') > -1);
};

const addFileToProject = (project, filePath) => {
  const file = new PbxFile(filePath);
  file.uuid = project.generateUuid();
  file.fileRef = project.generateUuid();
  project.addToPbxFileReferenceSection(file);
  return file;
};

const addProjectToLibraries = (libraries, file) => {
  return libraries.children.push({
    value: file.fileRef,
    comment: file.basename,
  });
};

module.exports = function registerNativeModuleIOS(name, dependencyConfig, projectConfig) {
  const project = xcode.project(projectConfig.pbxproj).parseSync();
  const dependencyProject = xcode.project(dependencyConfig.pbxproj).parseSync();

  const libraries = project.pbxGroupByName('Libraries');
  if (hasLibraryImported(libraries, dependencyConfig.projectName)) {
    return;
  }

  const file = addFileToProject(
    project,
    path.relative(projectConfig.src, dependencyConfig.project)
  );

  addProjectToLibraries(libraries, file);

  getProducts(dependencyProject).forEach(product => {
    project.addStaticLibrary(product, {
      target: project.getFirstTarget().uuid,
    });
  });

  fs.writeFileSync(
    projectConfig._pbxproj,
    project.writeSync()
  );
};
