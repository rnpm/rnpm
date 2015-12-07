const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');

const commands = require('./fixtures/commands');
const testPluginPath = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test');
const testPluginPath2 = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test-2');
const pjsonPath = path.join(__dirname, '..', 'package.json');

describe('getCommands', () => {

  beforeEach(() => {
    mock(pjsonPath, {
      dependencies: {
        [path.basename(testPluginPath)]: '*',
      },
    });
  });

  it('list of the commands should be a non-empty array', () => {
    mock(testPluginPath, commands.single);
    expect(getCommands()).to.be.not.empty;
    expect(getCommands()).to.be.an('array');
  });

  it('should export one command', () => {
    mock(testPluginPath, commands.single);
    expect(getCommands().length).to.be.equal(1);
  });

  it('should export multiple commands', () => {
    mock(testPluginPath, commands.multiple);
    expect(getCommands().length).to.be.equal(2);
  });

  it('should export unique list of commands by name', () => {
    mock(pjsonPath, {
      dependencies: {
        [path.basename(testPluginPath)]: '*',
        [path.basename(testPluginPath2)]: '*',
      },
    });
    mock(testPluginPath, commands.single);
    mock(testPluginPath2, commands.single);

    expect(getCommands().length).to.be.equal(1);
  });

  afterEach(mock.stopAll);

});
