const path = require('path');
const expect = require('chai').expect;
const findAndroidAppFolder = require('../../src/config/android/findAndroidAppFolder');

describe('findAndroidAppFolder', () => {

  it('should return an android app folder if it exists in the given folder', () => {
    const flat = path.join(process.cwd(), 'test', 'android', 'fixtures', 'flat-structure');
    const nested = path.join(process.cwd(), 'test', 'android', 'fixtures', 'nested-structure');

    expect(findAndroidAppFolder(flat)).to.be.equal('android');
    expect(findAndroidAppFolder(nested)).to.be.equal(path.join('android', 'app'));
  });

  it('should return `null` if there\'s no android app folder', () => {
    const emptyFolder = path.join(process.cwd(), 'test', 'android', 'fixtures', 'empty');
    expect(findAndroidAppFolder(emptyFolder)).to.be.null;
  });
});
