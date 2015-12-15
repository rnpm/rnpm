const path = require('path');
const expect = require('chai').expect;
const getProjectConfig = require('../../src/config/android').projectConfig;
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('android::getProjectConfig', () => {

  before(() => {
    mockFs({ testDir: projects });
  });

  it('should return `null` if manifest file hasn\'t been found', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'empty');

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'nested');

    expect(getProjectConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'empty');

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });

});
