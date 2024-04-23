import { log } from '..';

jest.spyOn(global.console, 'log');

describe('@repo/logger', () => {
  it('prints a message', () => {
    log('hello');
    expect(console.debug).toHaveBeenCalledWith('logger: ', 'hello');
  });
});
