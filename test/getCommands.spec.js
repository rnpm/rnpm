const path = require('path');
const Module = require('module');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const mockFs = require('mock-fs');
const mockRequire = require('mock-require');

const commands = require('./fixtures/commands');
const plugins = require('./fixtures/plugins');

const pluginFolder = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-link');

describe('getCommands', () => {

  it('list of the commands should be an array', () => {
    expect(getCommands()).to.be.an('array');
  });

  it('should contain some pre-defined commands by default', () => {
    expect(getCommands()).to.be.not.empty;
  });

  it('should return a single command (plugin export one command)', () => {
    mockRequire(pluginFolder, commands.single);
    expect(getCommands().length).to.be.equal(1);
  });

  it('should return multiple commands (plugin export an array of commands)', () => {
    mockRequire(pluginFolder, commands.multiple);
    expect(getCommands().length).to.be.equal(2);
  });

  it('should return an unique list of commands (by name)', () => {
    mockRequire(
      path.join(__dirname, '..', 'package.json'),
      plugins.valid
    );
    mockRequire(
      path.join(process.cwd(), 'node_modules', 'rnpm-plugin-build'),
      require('../node_modules/rnpm-plugin-link')
    );
    expect(getCommands().length).to.be.equal(1);
  });

  afterEach(() => {
    mockRequire.stopAll();
  });
});
