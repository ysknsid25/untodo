/**
 * Base meta passed to {@link TODO}.
 *
 * Users can extend it via Declaration Merging - additional fields are additive,
 * so `reason` is always required:
 *
 * ```ts
 * declare module 'untodo' {
 *   interface TodoMeta {
 *     issue?: number | string;
 *     assignee?: string;
 *   }
 * }
 * ```
 */
export interface TodoMeta {
  /** Human-readable reason this code is unimplemented. Required. */
  reason: string;
}

/**
 * Base meta passed to {@link FIXME}.
 *
 * Extendable via Declaration Merging in the same way as {@link TodoMeta}.
 */
export interface FixmeMeta {
  /** Human-readable description of what is broken. Required. */
  reason: string;
}

/**
 * Base meta passed to {@link HACK}.
 *
 * Extendable via Declaration Merging in the same way as {@link TodoMeta}.
 */
export interface HackMeta {
  /** Human-readable description of the workaround. Required. */
  reason: string;
}

/**
 * Union of all meta shapes accepted by the untodo function family.
 */
export type AnyUntodoMeta = TodoMeta | FixmeMeta | HackMeta;
