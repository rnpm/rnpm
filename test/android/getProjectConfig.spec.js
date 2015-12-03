const path = require('path');
const expect = require('chai').expect;
const getProjectConfig = require('../../src/config/android').projectConfig;
const mockFs = require('mock-fs');
const dependencies = require('../fixtures/dependencies');

describe('Config::getProjectConfig', () => {

  before(() => {
    mockFs({ testDir: dependencies });
  });

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'react-native-vector-icons');

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
