jest.autoMockOff();

const makeCommand = require('../src/makeCommand');

describe('makeCommand', () => {
  const command = makeCommand('echo');

  it('should generate a function around shell command', () => {
    expect(typeof command).toBe('function');
  });

  it('should throw an error if there\'s no callback provided', () => {
    expect(command).toThrow();
  });

  it('should invoke a callback after command execution', (done) => {
    const spy = jest.genMockFunction();

    command(spy);

    setTimeout(() => {
      expect(spy.calls.length).toBe(1);
      done();
    }, 1);
  });
});
