const path = require('path');
const expect = require('chai').expect;
const getDependencyConfig = require('../../src/config/android').dependencyConfig;

describe('Config::getDependencyConfig', () => {

  it('should return an object with android project configuration', () => {
    const userConfig = {};
    const folder = path.join(process.cwd(), 'node_modules', 'react-native-vector-icons');

    expect(getDependencyConfig(folder, userConfig)).to.be.an('object');
  });

  it('should return `null` if android project was not found', () => {
    const userConfig = {};
    const folder = path.join(process.cwd(), 'test', 'fixtures', 'empty');

    expect(getDependencyConfig(folder, userConfig)).to.be.null;
  });
});
