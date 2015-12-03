const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const findAndroidAppFolder = require('../../src/config/android/findAndroidAppFolder');

describe('findAndroidAppFolder', () => {

  it('should return an android app folder if it exists in the given folder', () => {
    const flat = path.join('test', 'android', 'fixtures', 'flat-structure');
    const nested = path.join('test', 'android', 'fixtures', 'nested-structure');

    expect(findAndroidAppFolder(flat)).to.be.equal('android');
    expect(findAndroidAppFolder(nested)).to.be.equal(path.join('android', 'app'));
  });

  it('should return `null` if there\'s no android app folder', () => {
    expect(findAndroidAppFolder(path.join('test', 'android', 'fixtures', 'empty'))).to.be.null;
  });
});
