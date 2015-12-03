const path = require('path');
const expect = require('chai').expect;
const getDependencyConfig = require('../../src/config/android').dependencyConfig;
const mockFs = require('mock-fs');
const dependencies = require('../fixtures/dependencies');

describe('ConfigAndroid::getDependencyConfig', () => {

  before(() => {
    mockFs({ testDir: dependencies });
  });

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'valid');

    expect(getDependencyConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'empty');

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  it('should return `null` if android project does not contain ReactPackage', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'noPackage');

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });
});
