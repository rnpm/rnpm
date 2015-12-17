const path = require('path');
const expect = require('chai').expect;
const getCommands = require('../src/getCommands');
const mock = require('mock-require');
const mockFs = require('mock-fs');
const sinon = require('sinon');
const rewire = require('rewire');

const commands = require('./fixtures/commands');

/**
 * Paths to two possible `node_modules` locations `rnpm` can be installed
 */
const LOCAL_NODE_MODULES = path.join(process.cwd(), 'node_modules');
const GLOBAL_NODE_MODULES = '/usr/local/lib/node_modules';

/**
 * Paths to `package.json` of project, and rnpm - in two installation locations
 */
const APP_JSON = path.join(process.cwd(), 'package.json');
const GLOBAL_RNPM_PJSON = path.join(GLOBAL_NODE_MODULES, '/rnpm/package.json');
const LOCAL_RNPM_PJSON = path.join(LOCAL_NODE_MODULES, 'rnpm/package.json');

/**
 * Sample `rnpm` plugin used in test cases
 */
const SAMPLE_RNPM_PLUGIN = 'rnpm-plugin-test';

/**
 * Sample `package.json` of RNPM that will be used in test cases
 */
const SAMPLE_RNPM_JSON = {
  dependencies: {
    [SAMPLE_RNPM_PLUGIN]: '*',
  },
};

/**
 * Project without `rnpm` plugins defined
 */
const NO_PLUGINS_JSON = {
  dependencies: {},
};

describe('getCommands', () => {

  afterEach(mock.stopAll);

  describe('in all installations', () => {

    var getCommands;
    var revert;

    before(() => {
      getCommands = rewire('../src/getCommands');
      revert = getCommands.__set__({__dirname: path.join(LOCAL_NODE_MODULES, 'rnpm/src')});
    });

    /**
     * In this suite we only test `rnpm` package.json, thus we make sure
     * that project json on process.cwd() is properly mocked.
     */
    beforeEach(() => {
      mock(APP_JSON, NO_PLUGINS_JSON);
    });

    after(() => revert());

    it('list of the commands should be a non-empty array', () => {
      mock(LOCAL_RNPM_PJSON, SAMPLE_RNPM_JSON);
      mock(SAMPLE_RNPM_PLUGIN, commands.single);

      expect(getCommands()).to.be.not.empty;
      expect(getCommands()).to.be.an('array');
    });

    it('should export one command', () => {
      mock(LOCAL_RNPM_PJSON, SAMPLE_RNPM_JSON);
      mock(SAMPLE_RNPM_PLUGIN, commands.single);

      expect(getCommands().length).to.be.equal(1);
    });

    it('should export multiple commands', () => {
      mock(LOCAL_RNPM_PJSON, SAMPLE_RNPM_JSON);
      mock(SAMPLE_RNPM_PLUGIN, commands.multiple);

      expect(getCommands().length).to.be.equal(2);
    });

    it('should export unique list of commands by name', () => {
      mock(LOCAL_RNPM_PJSON, {
        dependencies: {
          [SAMPLE_RNPM_PLUGIN]: '*',
          [`${SAMPLE_RNPM_PLUGIN}-2`]: '*',
        },
      });

      mock(SAMPLE_RNPM_PLUGIN, commands.single);
      mock(`${SAMPLE_RNPM_PLUGIN}-2`, commands.single);

      expect(getCommands().length).to.be.equal(1);
    });

  });

  describe('project plugins', () => {

    var getCommands;
    var revert;

    before(() => {
      getCommands = rewire('../src/getCommands');
    });

    /**
     * In this test suite we only test project plugins thus we make sure
     * `rnpm` package.json is properly mocked
     */
    beforeEach(() => {
      mock(LOCAL_RNPM_PJSON, NO_PLUGINS_JSON);
      mock(GLOBAL_RNPM_PJSON, NO_PLUGINS_JSON);
    });

    afterEach(() => revert());

    it('shoud load when installed locally', () => {
      revert = getCommands.__set__({__dirname: path.join(LOCAL_NODE_MODULES, 'rnpm/src')});

      mock(APP_JSON, SAMPLE_RNPM_JSON);
      mock(
        path.join(LOCAL_NODE_MODULES, SAMPLE_RNPM_PLUGIN),
        commands.single
      );

      expect(getCommands()[0]).to.be.equal(commands.single);
    });

    it('should load when installed globally', () => {
      revert = getCommands.__set__({__dirname: path.join(GLOBAL_NODE_MODULES, 'rnpm/src')});

      mock(APP_JSON, SAMPLE_RNPM_JSON);
      mock(
        path.join(LOCAL_NODE_MODULES, SAMPLE_RNPM_PLUGIN),
        commands.single
      );

      expect(getCommands()[0]).to.be.equal(commands.single);
    });

  });

  describe('rnpm and project plugins', () => {

    var getCommands;
    var revert;

    before(() => {
      getCommands = rewire('../src/getCommands');
      revert = getCommands.__set__({__dirname: path.join(LOCAL_NODE_MODULES, 'rnpm/src')});
    });

    after(() => revert());

    it('should load concatenated list of plugins', () => {
      mock(APP_JSON, SAMPLE_RNPM_JSON);
      mock(LOCAL_RNPM_PJSON, {
        dependencies: {
          [`${SAMPLE_RNPM_PLUGIN}-2`]: '*',
        },
      });

      mock(
        path.join(LOCAL_NODE_MODULES, SAMPLE_RNPM_PLUGIN),
        commands.multiple
      );
      mock(`${SAMPLE_RNPM_PLUGIN}-2`, commands.single);

      expect(getCommands().length).to.be.equal(2);
    });

  });

});
