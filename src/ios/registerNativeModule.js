const xcode = require('xcode');
const fs = require('fs');
const path = require('path');
const PbxFile = require('xcode/lib/pbxFile');

/**
 * Given an array of libraries already imported and packageName that will be
 * added, returns true or false depending on whether the library is already linked
 * or not
 */
const hasLibraryImported = (libraries, packageName) => {
  return libraries.children.filter(library => library.comment === packageName).length > 0;
};

/**
 * Given xcodeproj it returns list of products ending with
 * .a extension, so that we know what elements add to target
 * project static library
 */
const getProducts = (project) => {
  return project
    .pbxGroupByName('Products')
    .children
    .map(c => c.comment)
    .filter(c => c.indexOf('.a') > -1);
};

/**
 * Given xcodeproj and filePath, it creates new file
 * from path provided, adds it to the project
 * and returns newly created instance of a file
 */
const addFileToProject = (project, filePath) => {
  const file = new PbxFile(filePath);
  file.uuid = project.generateUuid();
  file.fileRef = project.generateUuid();
  project.addToPbxFileReferenceSection(file);
  return file;
};

/**
 * Given an array of xcodeproj libraries and pbxFile,
 * it appends it to that group
 */
const addProjectToLibraries = (libraries, file) => {
  return libraries.children.push({
    value: file.fileRef,
    comment: file.basename,
  });
};

/**
 * Register native module IOS adds given dependency to project by adding
 * its xcodeproj to project libraries as well as attaching static library
 * to the first target (the main one)
 *
 * If library is already linked, this action is a no-op.
 */
module.exports = function registerNativeModuleIOS(dependencyConfig, projectConfig) {
  const project = xcode.project(projectConfig.pbxprojPath).parseSync();
  const dependencyProject = xcode.project(dependencyConfig.pbxprojPath).parseSync();

  const libraries = project.pbxGroupByName('Libraries');
  if (hasLibraryImported(libraries, dependencyConfig.projectName)) {
    return;
  }

  const file = addFileToProject(
    project,
    path.relative(projectConfig.sourceDir, dependencyConfig.projectPath)
  );

  addProjectToLibraries(libraries, file);

  getProducts(dependencyProject).forEach(product => {
    project.addStaticLibrary(product, {
      target: project.getFirstTarget().uuid,
    });
  });

  fs.writeFileSync(
    projectConfig.pbxprojPath,
    project.writeSync()
  );
};
