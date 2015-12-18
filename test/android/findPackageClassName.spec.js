const path = require('path');
const expect = require('chai').expect;
const findPackageClassName = require('../../src/config/android/findPackageClassName');
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::findPackageClassName', () => {

  before(() => mockFs({
    empty: {},
    flat: {
      android: mocks.valid,
    },
  }));

  it('should return manifest content if file exists in the folder', () => {
    expect(findPackageClassName('flat')).to.be.a('string');
  });

  it('should return `null` if there\'s no matches', () => {
    expect(findPackageClassName('empty')).to.be.null;
  });

  after(mockFs.restore);
});
