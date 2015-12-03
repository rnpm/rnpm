const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const getProjectConfig = require('../../src/config/android').projectConfig;

describe('Config::getProjectConfig', () => {

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join(process.cwd(), 'node_modules', 'react-native-vector-icons');

    expect(getProjectConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join(process.cwd(), 'test', 'fixtures', 'empty');

    expect(getProjectConfig(folder, userConfig)).to.be.null;
  });
});
