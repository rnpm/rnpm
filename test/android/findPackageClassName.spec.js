const path = require('path');
const expect = require('chai').expect;
const findPackageClassName = require('../../src/config/android/findPackageClassName');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('findPackageClassName', () => {

  before(() => {
    mockFs({ testDir: projects });
  });

  it('should return manifest content if file exists in the folder', () => {
    const fixturesFolder = path.join('testDir', 'flat');
    expect(findPackageClassName(fixturesFolder)).to.be.a('string');
  });

  it('should return `null` if there\'s no matches', () => {
    const emptyFolder = path.join('testDir', 'empty');
    expect(findPackageClassName(emptyFolder)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });

});
