const path = require('path');
const expect = require('chai').expect;
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');

const plugins = require('./fixtures/plugins');

const testDir = path.join(__dirname, '..');
const pjsonPath = path.join(__dirname, '..', 'package.json');

describe('findPlugins', () => {

  it('list of the plugins should be an array', () => {
    const foundPlugins = findPlugins(testDir);
    expect(foundPlugins).to.be.an('array');
  });

  it('should return an empty array if there\'re no plugins in this folder', () => {
    mock(pjsonPath, plugins.empty);
    expect(findPlugins(testDir).length).to.be.equal(0);
  });

  it('should return an array from both dependencies and devDependencies', () => {
    mock(pjsonPath, plugins.valid);
    expect(findPlugins(testDir).length).to.be.equal(2);
  });

  it('should return an unique array', () => {
    mock(pjsonPath, plugins.duplicates);
    expect(findPlugins(testDir).length).to.be.equal(1);
  });

  afterEach(() => {
    mock.stopAll();
  });

});
