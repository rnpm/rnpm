const path = require('path');
const expect = require('chai').expect;
const findManifest = require('../../src/config/android/findManifest');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('findManifest', () => {

  before(() => {
    mockFs(projects);
  });

  it('should return a manifest path if file exists in the folder', () => {
    const fixturesPath = path.join('testing', 'flat');
    expect(findManifest(fixturesPath)).to.be.a('string');
  });

  it('should return `null` if there is no manifest in the folder', () => {
    const emptyFolder = path.join('testing', 'empty');
    expect(findManifest(emptyFolder)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });

});
