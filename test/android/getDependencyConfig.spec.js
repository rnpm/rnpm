const path = require('path');
const expect = require('chai').expect;
const getDependencyConfig = require('../../src/config/android').dependencyConfig;
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::getDependencyConfig', () => {

  before(() => mockFs({
    empty: {},
    nested: {
      android: {
        app: mocks.valid,
      },
    },
    noPackage: {
      android: {},
    },
  }));

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = 'nested';

    expect(getDependencyConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if manifest file hasn\'t been found', () => {
    const userConfig = {};
    const folder = 'empty';

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = 'empty';

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  it('should return `null` if android project does not contain ReactPackage', () => {
    const userConfig = {};
    const folder = 'noPackage';

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });

  after(mockFs.restore);
});
