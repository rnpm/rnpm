const path = require('path');
const expect = require('chai').expect;
const readManifest = require('../../src/config/android/readManifest');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('readManifest', () => {

  before(() => {
    mockFs(projects);
  });

  it('should return manifest content if file exists in the folder', () => {
    const manifestPath = path.join(
      'testing', 'flat', 'android', 'src', 'AndroidManifest.xml'
    );

    expect(readManifest(manifestPath)).to.be.an('object');
  });

  it('should throw an error if there is no manifest in the folder', () => {
    const fakeManifestPath = path.join('testing', 'empty', 'AndroidManifest.xml');
    expect(() => readManifest(fakeManifestPath)).to.throw(Error);
  });

  after(() => {
    mockFs.restore();
  });

});
