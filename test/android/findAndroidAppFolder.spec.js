const path = require('path');
const expect = require('chai').expect;
const findAndroidAppFolder = require('../../src/config/android/findAndroidAppFolder');
const mockFs = require('mock-fs');
const mocks = require('../fixtures/android');

describe('android::findAndroidAppFolder', () => {

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
  }));

  it('should return an android app folder if it exists in the given folder', () => {
    expect(findAndroidAppFolder('flat')).to.be.equal('android');
    expect(findAndroidAppFolder('nested')).to.be.equal(path.join('android', 'app'));
  });

  it('should return `null` if there\'s no android app folder', () => {
    expect(findAndroidAppFolder('empty')).to.be.null;
  });

  after(mockFs.restore);
});
