const path = require('path');
const expect = require('chai').expect;
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');
const dependencies = require('./fixtures/dependencies');

const testDir = path.join(__dirname, '..');
const pjsonPath = path.join(__dirname, '..', 'package.json');

const validPackage = {
  dependencies: {
    'rnpm-plugin-link': '1.0.0',
  },
  devDependencies: {
    'rnpm-plugin-build': '1.0.0',
  },
};

const withDuplicates = {
  dependencies: {
    'rnpm-plugin-link': '1.0.0',
  },
  devDependencies: {
    'rnpm-plugin-link': '1.0.0',
  },
};

const emptyPackage = {};

describe('findPlugins', () => {

  it('list of the plugins should be an array', () => {
    const plugins = findPlugins(testDir);
    expect(plugins).to.be.an('array');
  });

  it('should return an empty array if there\'re no plugins in this folder', () => {
    mock(pjsonPath, emptyPackage);
    const plugins = findPlugins(testDir);
    expect(plugins).to.be.an('array');
    expect(plugins).to.be.empty;
  });

  it('should return an array from both dependencies and devDependencies', () => {
    mock(pjsonPath, validPackage);
    expect(findPlugins(testDir).length).to.be.equal(2);
  });

  it('should return an unique array', () => {
    mock(pjsonPath, withDuplicates);
    expect(findPlugins(testDir).length).to.be.equal(1);
  });

  afterEach(() => {
    mock.stopAll();
  });

});
