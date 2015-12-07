const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const findPlugins = require('../src/findPlugins');
const mockRequire = require('mock-require');

const commands = getCommands();
const filesPath = path.join(__dirname, 'fixtures', 'files');
const testPluginPath = path.join(__dirname, '..', 'node_modules', 'rnpm-plugin-test');
const singlePlugin = require(path.join(filesPath, 'plugin'));
const multiPlugin = require(path.join(filesPath, 'plugins'));

describe('getCommands', () => {

  beforeEach(() => {
    mockRequire(path.join(__dirname, '..'), {});
    mockRequire(
      path.join(__dirname, '..', 'package.json'),
      require(path.join(filesPath, 'package'))
    );
  });

  afterEach(mockRequire.stopAll);

  it('list of the commands should be a non-empty array', () => {
    expect(commands).to.be.not.empty;
    expect(commands).to.be.an('array');
  });

  it('should return a single command (plugin export one command)', () => {
    mockRequire(testPluginPath, singlePlugin);
    expect(getCommands().length).to.be.equal(1);
  });

  it('should return a single command (plugin export one command)', () => {
    mockRequire(testPluginPath, multiPlugin);
    expect(getCommands().length).to.be.equal(2);
  });
});
