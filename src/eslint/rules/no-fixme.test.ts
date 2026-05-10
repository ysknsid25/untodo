import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';
import { noFixme } from './no-fixme';

RuleTester.afterAll = afterAll;
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester();

ruleTester.run('no-fixme', noFixme, {
  valid: ['fix();'],
  invalid: [
    {
      code: 'FIXME({ reason: "broken" });',
      errors: [{ messageId: 'noFixme' }],
    },
  ],
});
