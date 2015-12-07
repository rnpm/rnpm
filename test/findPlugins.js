const path = require('path');
const expect = require('chai').expect;
const findPlugins = require('../src/findPlugins');
const mock = require('mock-require');

const testDir = path.join(__dirname, '..');
const pjsonPath = path.join(testDir, 'package.json');

const singlePlugin = {
  dependencies: {
    'rnpm-plugin-test': '*',
  },
};

const manyPlugins = {
  dependencies: {
    'rnpm-plugin-test': '*',
  },
  devDependencies: {
    'rnpm-plugin-test-2': '*',
  },
};

const duplicates = {
  dependencies: {
    'rnpm-plugin-test': '*',
  },
  devDependencies: {
    'rnpm-plugin-test': '*',
  },
};

describe('findPlugins', () => {

  it('list of the plugins should be an array', () => {
    mock(pjsonPath, singlePlugin);
    expect(findPlugins(testDir)).to.be.an('array');
  });

  it('should return an empty array if there\'re no plugins in this folder', () => {
    mock(pjsonPath, {});
    expect(findPlugins(testDir).length).to.be.equal(0);
  });

  it('should return an array from both dependencies and devDependencies', () => {
    mock(pjsonPath, manyPlugins);
    expect(findPlugins(testDir).length).to.be.equal(2);
  });

  it('should return an unique array', () => {
    mock(pjsonPath, duplicates);
    expect(findPlugins(testDir).length).to.be.equal(1);
  });

  afterEach(() => {
    mock.stopAll();
  });

});
