const path = require('path');
const expect = require('chai').expect;
const findPackageClassName = require('../../src/config/android/findPackageClassName');

describe('findPackageClassName', () => {

  it('should return manifest content if file exists in the folder', () => {
    const fixturesFolder = path.join(process.cwd(), 'test', 'android', 'fixtures');
    expect(findPackageClassName(fixturesFolder)).to.be.a('string');
  });

  it('should return `null` if there\'s no matches', () => {
    const emptyFolder = path.join(process.cwd(), 'test', 'android', 'fixtures', 'empty');
    expect(findPackageClassName(emptyFolder)).to.be.null;
  });
});
