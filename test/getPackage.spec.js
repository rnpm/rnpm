const chai = require('chai');
const expect = chai.expect;
const getPackage = require('../src/config').getPackage;

describe('getPackage', () => {

  it('should return package.json content if file persists in the folder', () => {
    expect(getPackage(process.cwd())).to.be.an('object');
  });

  it('should throw an error if package.json isn\'t in the folder', () => {
    expect(() => getPackage('../error')).to.throw(Error);
  });
});
