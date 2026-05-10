import { describe, expect, it } from 'vitest';
import {
  FixmeError,
  HackError,
  NotImplementedError,
  UntodoError,
} from './errors';

describe('error hierarchy', () => {
  it('NotImplementedError extends UntodoError', () => {
    const error = new NotImplementedError('todo');
    expect(error).toBeInstanceOf(UntodoError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('NotImplementedError');
  });

  it('FixmeError extends UntodoError', () => {
    const error = new FixmeError('fixme');
    expect(error).toBeInstanceOf(UntodoError);
    expect(error.name).toBe('FixmeError');
  });

  it('HackError extends UntodoError', () => {
    const error = new HackError('hack');
    expect(error).toBeInstanceOf(UntodoError);
    expect(error.name).toBe('HackError');
  });
});
