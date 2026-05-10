import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';
import { noHack } from './no-hack';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester();

ruleTester.run('no-hack', noHack, {
  valid: ['hack();'],
  invalid: [
    {
      code: 'HACK({ reason: "shortcut" });',
      errors: [{ messageId: 'noHack' }],
    },
  ],
});
