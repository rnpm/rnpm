const path = require('path');
const expect = require('chai').expect;
const findManifest = require('../../src/config/android/findManifest');

describe('findManifest', () => {

  it('should return a manifest path if file exists in the folder', () => {
    const fixturesPath = path.join(process.cwd(), 'test', 'android', 'fixtures');
    expect(findManifest(fixturesPath)).to.be.a('string');
  });

  it('should return `null` if there is no manifest in the folder', () => {
    expect(findManifest('error')).to.be.null;
  });
});
