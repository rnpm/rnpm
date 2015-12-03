const path = require('path');
const expect = require('chai').expect;
const getDependencyConfig = require('../../src/config/android').dependencyConfig;
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('Config::getDependencyConfig', () => {

  before(() => {
    mockFs(projects);
  });

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join('testing', 'flat', 'node_modules', 'react-native-vector-icons');

    expect(getDependencyConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join('testing', 'fixtures', 'empty');

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });
});
