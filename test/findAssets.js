const path = require('path');
const expect = require('chai').expect;
const findAssets = require('../src/config/findAssets');
const mockFs = require('mock-fs');
const dependencies = require('./fixtures/dependencies');

describe('findAssets', () => {

  before(() => {
    mockFs({ testDir: dependencies });
  });

  it('should return an array of all files in given folder', () => {
    const assets = findAssets(
      path.join('testDir', 'withAssets'),
      ['fonts']
    );

    expect(assets).to.be.an('array');
    expect(assets.length).to.equal(3);
  });

  after(() => {
    mockFs.restore();
  });
});
