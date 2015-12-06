const path = require('path');
const Module = require('module');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const findPlugins = require('../src/findPlugins');
const mockRequire = require('mock-require');
const mockFs = require('mock-fs');

const commands = getCommands();
const filesPath = path.join(__dirname, 'fixtures', 'files');
const testPlugin = findPlugins(filesPath);
const testPluginPath = path.join(__dirname, '..', 'node_modules', 'rnpm-plugin-test');
const singlePlugin = require(path.join(filesPath, 'plugin'));
const multiPlugin = require(path.join(filesPath, 'plugins'));

describe('getCommands', () => {

  before(() => {
    mockRequire(path.join(__dirname, '..'), {});
    mockRequire(
      path.join(__dirname, '..', 'package.json'),
      require(path.join(filesPath, 'package'))
    );
  });

  it('list of the commands should be an array', () => {
    expect(commands).to.be.an('array');
  });

  it('should contain some pre-defined commands by default', () => {
    expect(commands).to.be.not.empty;
  });

  it('should return a single command (plugin export one command)', () => {
    mockRequire(testPluginPath, singlePlugin);
    expect(getCommands().length).to.be.equal(1);
    mockRequire.stop();
  });

  it('should return a single command (plugin export one command)', () => {
    mockRequire(testPluginPath, multiPlugin);
    expect(getCommands().length).to.be.equal(2);
    mockRequire.stop();
  });

  after(() => {
    mockFs.restore();
    mockRequire.stopAll();
  });
});
