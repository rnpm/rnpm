const path = require('path');
const expect = require('chai').expect;
const findAndroidAppFolder = require('../../src/config/android/findAndroidAppFolder');
const mockFs = require('mock-fs');
const projects = require('../fixtures/projects');

describe('findAndroidAppFolder', () => {

  before(() => {
    mockFs(projects);
  });

  it('should return an android app folder if it exists in the given folder', () => {
    const flat = path.join('testing', 'flat');
    const nested = path.join('testing', 'nested');

    expect(findAndroidAppFolder(flat)).to.be.equal('android');
    expect(findAndroidAppFolder(nested)).to.be.equal(path.join('android', 'app'));
  });

  it('should return `null` if there\'s no android app folder', () => {
    const emptyFolder = path.join('testing', 'empty');
    expect(findAndroidAppFolder(emptyFolder)).to.be.null;
  });

  after(() => {
    mockFs.restore();
  });
});
