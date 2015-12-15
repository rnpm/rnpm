const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const mock = require('mock-require');
const mockFs = require('mock-fs');
const sinon = require('sinon');
const rewire = require('rewire');

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

const appJSON = path.join(process.cwd(), 'package.json');
const appNodeModules = path.join(process.cwd(), 'node_modules');
const globalNodeModules = '/usr/local/lib/node_modules';

describe('getCommands', () => {

  beforeEach(() => {
    mock(pjsonPath, pjson);
    mock('rnpm-plugin-test', commands.single);
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
    mock('rnpm-plugin-test', commands.multiple);

    expect(getCommands().length).to.be.equal(2);
  });

  it('should export unique list of commands by name', () => {
    mock(pjsonPath, {
      dependencies: {
        [path.basename(nestedPluginPath)]: '*',
        [path.basename(nestedPluginPath2)]: '*',
      },
    });
    mock('rnpm-plugin-test-2', commands.single);

    expect(getCommands().length).to.be.equal(1);
  });

  describe('in local installation', () => {

    var getCommands;
    var revert;

    before(() => {
      getCommands = rewire('../src/getCommands');
      revert = getCommands.__set__('__dirname', path.join(appNodeModules, 'rnpm/src'));
    });

    it('should load rnpm plugins', () => {
      mock('rnpm-plugin-global', {name: 'global'});
      mock(appJSON, {});
      mock(path.join(appNodeModules, 'rnpm/package.json'), {
        dependencies: {
          'rnpm-plugin-global': '*',
        },
      });

      expect(getCommands()[0].name).to.be.equal('global');
    });

    it('should load app specific plugins', () => {
      mock('rnpm-plugin-local-app-plugin', {name: 'local'});
      mock(path.join(appNodeModules, 'rnpm/package.json'), {});
      mock(appJSON, {
        dependencies: {
          'rnpm-plugin-local-app-plugin': '*',
        },
      });

      expect(getCommands()[0].name).to.be.equal('local');
    });

    after(() => revert());

  });

  describe('in global installation', () => {

    var getCommands;
    var revert;

    before(() => {
      getCommands = rewire('../src/getCommands');
      revert = getCommands.__set__('__dirname', path.join(globalNodeModules, 'rnpm/src'));
    });

    it('should load rnpm own plugins', () => {
      mock('rnpm-plugin-global', {name: 'global'});
      mock(appJSON, {});
      mock(path.join(globalNodeModules, '/rnpm/package.json'), {
        dependencies: {
          'rnpm-plugin-global': '*',
        },
      });

      expect(getCommands()[0].name).to.be.equal('global');
    });

    it('should load app specific plugins', () => {
      mock(path.join(appNodeModules, 'rnpm-plugin-local-app-plugin'), {name: 'local'});
      mock(path.join(globalNodeModules, '/rnpm/package.json'), {});
      mock(appJSON, {
        dependencies: {
          'rnpm-plugin-local-app-plugin': '*',
        },
      });

      expect(getCommands()[0].name).to.be.equal('local');
    });

    after(() => revert());

  });


  afterEach(mock.stopAll);

});
