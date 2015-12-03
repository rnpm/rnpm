const path = require('path');
const expect = require('chai').expect;
const findAssets = require('../src/config/findAssets');
const mockFs = require('mock-fs');
const dependencies = require('./fixtures/dependencies');

describe('findAssets', () => {

  before(() => {
    mockFs({ testDir: dependencies });
  });

  it('should return an array of all files in given folders', () => {
    const assets = findAssets(
      path.join('testDir', 'withAssets'),
      ['fonts', 'images']
    );

    expect(assets).to.be.an('array');
    expect(assets.length).to.equal(3);
  });

  it('should return absoulte paths to assets', () => {
    const folder = path.join('testDir', 'withAssets');
    const assets = findAssets(
      path.join('testDir', 'withAssets'),
      ['fonts', 'images']
    );

    assets.forEach(assetPath => expect(assetPath).to.contain(folder));
  });

  after(() => {
    mockFs.restore();
  });
});
