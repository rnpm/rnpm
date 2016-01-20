const path = require('path');
const expect = require('chai').expect;
const findProject = require('../../src/config/ios/findProject');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('ios::findProject', () => {

  before(() => {
    mockFs({ testDir: projects });
  });

  it('should return path to xcodeproj if found', () => {
    const userConfig = {};

    mockFs(projects.flat);

    expect(findProject('')).to.contain('.xcodeproj');
  });

  it('should ignore xcodeproj from example folders', () => {
    const userConfig = {};

    mockFs({
      examples: projects.flat,
      Examples: projects.flat,
      example: projects.flat,
      KeychainExample: projects.flat,
      Zpp: projects.flat,
    });

    expect(findProject('').toLowerCase()).to.not.contain('example');
  });

  it('should ignore xcodeproj from test folders at any level', () => {
    const userConfig = {};

    mockFs({
      test: projects.flat,
      IntegrationTests: projects.flat,
      tests: projects.flat,
      Zpp: {
        tests: projects.flat,
        src: projects.flat,
      },
    });

    expect(findProject('').toLowerCase()).to.not.contain('test');
  });

  afterEach(() => {
    mockFs.restore();
  });

});
