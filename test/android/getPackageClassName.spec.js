const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const getPackageClassName = require('../../src/config/android/getPackageClassName');

describe('getPackageClassName', () => {

  it('should return manifest content if file persists in the folder', () => {
    expect(getPackageClassName(path.join('test', 'android', 'fixtures'))).to.be.a('string');
  });

  it('should return `null` if there\'s no matches', () => {
    expect(getPackageClassName(path.join('test', 'android', 'fixtures', 'empty'))).to.be.null;
  });
});
