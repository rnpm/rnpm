const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');
const mockFs = require('mock-fs');
const sinon = require('sinon');

const commands = require('./fixtures/commands');
const nestedPluginPath = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test');
const nestedPluginPath2 = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test-2');
const flatPluginPath = path.join(process.cwd(), '..', 'rnpm-plugin-test');
const flatPluginPath2 = path.join(process.cwd(), '..', 'rnpm-plugin-test-2');
const pjsonPath = path.join(__dirname, '..', 'package.json');

const pjson = {
  dependencies: {
    [path.basename(nestedPluginPath)]: '*',
  },
};

describe('getCommands', () => {

  beforeEach(() => {
    mock(pjsonPath, pjson);
    mock(nestedPluginPath, commands.single);
    mock(flatPluginPath, commands.single);
  });

  it('list of the commands should be a non-empty array', () => {
    expect(getCommands()).to.be.not.empty;
    expect(getCommands()).to.be.an('array');
  });

  it('should export one command', () => {
    expect(getCommands().length).to.be.equal(1);
  });

  it('should export multiple commands', () => {
    mock(nestedPluginPath, commands.multiple);
    mock(flatPluginPath, commands.multiple);

    expect(getCommands().length).to.be.equal(2);
  });

  it('should export unique list of commands by name', () => {
    mock(pjsonPath, {
      dependencies: {
        [path.basename(nestedPluginPath)]: '*',
        [path.basename(nestedPluginPath2)]: '*',
      },
    });
    mock(nestedPluginPath2, commands.single);
    mock(flatPluginPath2, commands.single);

    expect(getCommands().length).to.be.equal(1);
  });

  it('should get commands specified by project plugins', () => {
    mockFs({ testDir: {} });
    mock(
      path.join(process.cwd(), 'testDir', 'package.json'),
      pjson
    );
    mock(
      path.join(process.cwd(), 'testDir', 'node_modules', 'rnpm-plugin-test'),
      commands.multiple
    );
    mock(
      path.join(process.cwd(), 'testDir', '..', 'rnpm-plugin-test'),
      commands.multiple
    );

    const testCwd = path.join(process.cwd(), 'testDir');
    const stub = sinon.stub(process, 'cwd').returns(testCwd);

    expect(getCommands().length).to.be.equal(2);

    stub.restore();
    mockFs.restore();
  });

  afterEach(mock.stopAll);

});
