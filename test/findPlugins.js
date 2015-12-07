const path = require('path');
const expect = require('chai').expect;
const findPlugins = require('../src/findPlugins');
const mock = require('mock-fs');
const dependencies = require('./fixtures/dependencies');

describe('findPlugins', () => {
  before(() => mock(dependencies));

  it('list of the plugins should be an array', () => {
    const plugins = findPlugins('valid');
    expect(plugins).to.be.an('array');
  });

  it('should return an empty array if there\'re no plugins in this folder', () => {
    const plugins = findPlugins('empty');
    expect(plugins).to.be.an('array');
    expect(plugins).to.be.empty;
  });

  after(() => {
    mock.restore();
  });
});
