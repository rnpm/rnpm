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
    const folder = path.join('testDir', 'flat');

    expect(findProject(folder)).to.contain('.xcodeproj');
  });

  it('should ignore xcodeproj from examples', () => {
    const userConfig = {};
    const folder = path.join('testDir', 'withExamples');

    expect(findProject(folder)).to.not.contain('Examples');
  });


  after(() => {
    mockFs.restore();
  });

});
