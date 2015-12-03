const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const findPackageClassName = require('../../src/config/android/findPackageClassName');

describe('findPackageClassName', () => {

  it('should return manifest content if file persists in the folder', () => {
    const fixturesFolder = path.join('test', 'android', 'fixtures');
    expect(findPackageClassName(fixturesFolder)).to.be.a('string');
  });

  it('should return `null` if there\'s no matches', () => {
    const emptyFolder = path.join('test', 'android', 'fixtures', 'empty');
    expect(findPackageClassName(emptyFolder)).to.be.null;
  });
});
