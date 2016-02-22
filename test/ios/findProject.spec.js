jest.autoMockOff();

const findProject = require('../../src/config/ios/findProject');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');
const userConfig = {};

describe('ios::findProject', () => {

  beforeEach(() => {
    mockFs({ testDir: projects });
  });

  it('should return path to xcodeproj if found', () => {

    mockFs(projects.flat);

    expect(findProject('')).toContain('.xcodeproj');
  });

  it('should return null if there\'re no projects', () => {
    expect(findProject('')).toBe(null);
  });

  it('should ignore xcodeproj from example folders', () => {
    mockFs({
      examples: projects.flat,
      Examples: projects.flat,
      example: projects.flat,
      KeychainExample: projects.flat,
      Zpp: projects.flat,
    });

    expect(findProject('').toLowerCase()).not.toContain('example');
  });

  it('should ignore xcodeproj from test folders at any level', () => {
    mockFs({
      test: projects.flat,
      IntegrationTests: projects.flat,
      tests: projects.flat,
      Zpp: {
        tests: projects.flat,
        src: projects.flat,
      },
    });

    expect(findProject('').toLowerCase()).not.toContain('test');
  });

  afterEach(mockFs.restore);
});
