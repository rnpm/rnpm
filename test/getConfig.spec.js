const chai = require('chai');
const expect = chai.expect;
const getConfig = require('../src/getConfig');

describe('getConfig', () => {

  it('should return config if config persists in the folder', () => {
    expect(getConfig(process.cwd())).to.be.an('object');
  });

  it('should throw an error if it can\'t find a config', () => {
    expect(() => getConfig('../error')).to.throw(Error);
  });
});
