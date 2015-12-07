const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const mock = require('mock-require');

const commands = require('./fixtures/commands');

const testPlugin = path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test');
const pjsonPath = path.join(__dirname, '..', 'package.json');

const singlePlugin = {
  dependencies: {
    'rnpm-plugin-test': '*',
  },
};

const multipleCommands = {
  dependencies: {
    'rnpm-plugin-test': '*',
    'rnpm-plugin-test-2': '*',
  },
};

describe('getCommands', () => {

  it('list of the commands should be an array', () => {
    mock(pjsonPath, singlePlugin);
    mock(testPlugin, commands.single);
    expect(getCommands()).to.be.an('array');
  });

  it('should return a single command (plugin export one command)', () => {
    mock(pjsonPath, singlePlugin);
    mock(testPlugin, commands.single);
    expect(getCommands().length).to.be.equal(1);
  });

  it('should return multiple commands (plugin export an array of commands)', () => {
    mock(pjsonPath, singlePlugin);
    mock(testPlugin, commands.multiple);
    expect(getCommands().length).to.be.equal(2);
  });

  it('should return an unique list of commands (by name)', () => {
    mock(pjsonPath, multipleCommands);
    mock(testPlugin, commands.single);
    mock(
      path.join(process.cwd(), 'node_modules', 'rnpm-plugin-test-2'),
      commands.single
    );
    expect(getCommands().length).to.be.equal(1);
  });

  afterEach(() => {
    mock.stopAll();
  });
});
