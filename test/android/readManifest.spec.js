const path = require('path');
const expect = require('chai').expect;
const findManifest = require('../../src/config/android/findManifest');
const readManifest = require('../../src/config/android/readManifest');
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::readManifest', () => {

  before(() => mockFs({
    empty: {},
    nested: {
      android: {
        app: mocks.valid,
      },
    },
  }));

  it('should return manifest content if file exists in the folder', () => {
    const manifestPath = findManifest('nested');
    expect(readManifest(manifestPath)).to.be.an('object');
  });

  it('should throw an error if there is no manifest in the folder', () => {
    const fakeManifestPath = findManifest('empty');
    expect(() => readManifest(fakeManifestPath)).to.throw(Error);
  });

  after(mockFs.restore);
});
