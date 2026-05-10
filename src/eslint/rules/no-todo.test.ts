import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';
import { noTodo } from './no-todo';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester();

ruleTester.run('no-todo', noTodo, {
  valid: [
    'foo();',
    'const x = bar({ reason: "ok" });',
  ],
  invalid: [
    {
      code: 'TODO({ reason: "unimplemented" });',
      errors: [{ messageId: 'noTodo' }],
    },
    {
      code: 'function f() { return TODO({ reason: "wip" }); }',
      errors: [{ messageId: 'noTodo' }],
    },
  ],
});
