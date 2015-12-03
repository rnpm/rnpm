const path = require('path');
const expect = require('chai').expect;
const getProjectConfig = require('../../src/config/android').projectConfig;
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('Config::getProjectConfig', () => {

  before(() => {
    mockFs(projects);
  });

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join('testing', 'flat', 'node_modules', 'react-native-vector-icons');

    expect(getProjectConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join('testing', 'empty');

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });

});
