const path = require('path');
const expect = require('chai').expect;
const findManifest = require('../../src/config/android/findManifest');
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::findManifest', () => {

  before(() => mockFs({
    empty: {},
    flat: {
      android: mocks.valid,
    },
  }));

  it('should return a manifest path if file exists in the folder', () => {
    expect(findManifest('flat')).to.be.a('string');
  });

  it('should return `null` if there is no manifest in the folder', () => {
    expect(findManifest('empty')).to.be.null;
  });

  after(mockFs.restore);
});
