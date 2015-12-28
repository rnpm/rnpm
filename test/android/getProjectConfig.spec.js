const path = require('path');
const expect = require('chai').expect;
const getProjectConfig = require('../../src/config/android').projectConfig;
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::getProjectConfig', () => {
  before(() => mockFs({
    empty: {},
    nested: {
      android: {
        app: mocks.valid,
      },
    },
    flat: {
      android: mocks.valid,
    },
    noManifest: {
      android: {},
    },
  }));

  it('should return `null` if manifest file hasn\'t been found', () => {
    const userConfig = {};
    const folder = 'noManifest';

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });

  describe('return an object with android project configuration for', () => {
    it('nested structure', () => {
      const userConfig = {};
      const folder = 'nested';

      expect(getProjectConfig(folder, userConfig)).to.be.an('object');
    });

    it('flat structure', () => {
      const userConfig = {};
      const folder = 'flat';

      expect(getProjectConfig(folder, userConfig)).to.be.an('object');
    });
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = 'empty';

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });

  after(mockFs.restore);
});
