/**
 * Base class for all errors thrown by user-supplied untodo callbacks.
 *
 * The library itself never throws; this hierarchy exists so that consumers
 * who *want* to throw inside `onTodo` / `onFixme` / `onHack` can use a
 * consistent type for catch blocks.
 */
export class UntodoError extends Error {
  /**
   * @param message Human-readable error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'UntodoError';
  }
}

/**
 * Error intended to be thrown from a {@link TODO} callback when the missing
 * implementation must surface as a runtime failure.
 */
export class NotImplementedError extends UntodoError {
  /**
   * @param message Human-readable error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}

/**
 * Error intended to be thrown from a {@link FIXME} callback.
 */
export class FixmeError extends UntodoError {
  /**
   * @param message Human-readable error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'FixmeError';
  }
}

/**
 * Error intended to be thrown from a {@link HACK} callback.
 */
export class HackError extends UntodoError {
  /**
   * @param message Human-readable error message.
   */
  constructor(message: string) {
    super(message);
    this.name = 'HackError';
  }
}
