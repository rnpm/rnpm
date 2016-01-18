const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const makeCommand = require('../src/makeCommand');

const command = makeCommand('echo');

describe('makeCommand', () => {
  it('should generate a function around shell command', () => {
    expect(typeof command).to.be.equal('function');
  });

  it('should throw an error if there\'s no callback provided', () => {
    expect(command).to.throw(/missed a callback/);
  });

  it('should invoke a callback after command execution', (done) => {
    const spy = sinon.spy();

    command(spy);

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
      done();
    }, 100);
  });
});
