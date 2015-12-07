const path = require('path');
const expect = require('chai').expect;
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');

const pjsonPath = path.join(process.cwd(), 'package.json');

describe('findPlugins', () => {

  it('list of the plugins should be an array', () => {
    mock(pjsonPath, {
      dependencies: { 'rnpm-plugin-test': '*' },
    });
    expect(findPlugins(process.cwd())).to.be.an('array');
  });

  it('should return an empty array if there\'re no plugins in this folder', () => {
    mock(pjsonPath, {});
    expect(findPlugins(process.cwd())).to.be.empty;
  });

  it('should return plugins from both dependencies and dev dependencies', () => {
    mock(pjsonPath, {
      dependencies: { 'rnpm-plugin-test': '*' },
      devDependencies: { 'rnpm-plugin-test-2': '*' },
    });
    expect(findPlugins(process.cwd()).length).to.equals(2);
  });

  it('should return unique list of plugins', () => {
    mock(pjsonPath, {
      dependencies: { 'rnpm-plugin-test': '*' },
      devDependencies: { 'rnpm-plugin-test': '*' },
    });
    expect(findPlugins(process.cwd()).length).to.equals(1);
  });

  afterEach(mock.stopAll);

});
