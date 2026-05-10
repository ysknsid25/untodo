import { afterEach, describe, expect, it, vi } from 'vitest';
import { FIXME, HACK, TODO } from './todo';
import { defineConfig, resetConfig } from './config';

afterEach(() => {
  resetConfig();
});

describe('TODO', () => {
  it('returns undefined typed as never', () => {
    expect(TODO({ reason: 'unimplemented' })).toBeUndefined();
  });

  it('invokes the per-call callback with meta', () => {
    const cb = vi.fn();
    TODO({ reason: 'r' }, cb);
    expect(cb).toHaveBeenCalledWith({ reason: 'r' });
  });

  it('falls back to the global onTodo handler', () => {
    const onTodo = vi.fn();
    defineConfig({ onTodo });
    TODO({ reason: 'g' });
    expect(onTodo).toHaveBeenCalledWith({ reason: 'g' });
  });

  it('per-call callback overrides the global handler', () => {
    const onTodo = vi.fn();
    const cb = vi.fn();
    defineConfig({ onTodo });
    TODO({ reason: 'r' }, cb);
    expect(cb).toHaveBeenCalledOnce();
    expect(onTodo).not.toHaveBeenCalled();
  });
});

describe('FIXME', () => {
  it('uses the global onFixme handler when no callback is given', () => {
    const onFixme = vi.fn();
    defineConfig({ onFixme });
    FIXME({ reason: 'fix' });
    expect(onFixme).toHaveBeenCalledWith({ reason: 'fix' });
  });
});

describe('HACK', () => {
  it('uses the global onHack handler when no callback is given', () => {
    const onHack = vi.fn();
    defineConfig({ onHack });
    HACK({ reason: 'hack' });
    expect(onHack).toHaveBeenCalledWith({ reason: 'hack' });
  });
});
