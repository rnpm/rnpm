const path = require('path');
const expect = require('chai').expect;
const readManifest = require('../../src/config/android/readManifest');

describe('readManifest', () => {

  it('should return manifest content if file exists in the folder', () => {
    const manifestPath = path.join(
      process.cwd(), 'test', 'android', 'fixtures', 'AndroidManifest.xml'
    );

    expect(readManifest(manifestPath)).to.be.an('object');
  });

  it('should throw an error if there is no manifest in the folder', () => {
    const fakeManifestPath = path.join('whatever', 'AndroidManifest.xml');
    expect(() => readManifest(fakeManifestPath)).to.throw(Error);
  });
});
