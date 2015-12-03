const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const findManifest = require('../../src/config/android/findManifest');

describe('findManifest', () => {

  it('should return a manifest path if file exists in the folder', () => {
    expect(findManifest(path.join('test', 'android', 'fixtures'))).to.be.a('string');
  });

  it('should return `null` if there is no manifest in the folder', () => {
    expect(findManifest('error')).to.be.null;
  });
});
