import { stat } from 'fs/promises';

import { create } from '../name';
import { Options } from '../types';
import { TestCase, withCallbackWrapper } from './utils';

const cases: TestCase<Options>[] = [
  ['undefined', undefined],
  ['empty options', {}],
  ['template', { template: 'foo-XXXXXX-bar' }],
  ['prefix', { prefix: 'something' }],
  ['postfix', { postfix: '.tmp' }],
  ['fixed name', { name: 'fixed' }],
];

describe.each(withCallbackWrapper(cases))('create()', (callbackWrapper, cases) => {
  describe.each(cases)(callbackWrapper ? 'with callback' : 'without callback', (description, options) => {
    describe(`with ${description}`, () => {
      let path: string;

      beforeEach(async () => {
        const createFunction = callbackWrapper ? callbackWrapper(create) : create;
        path = await createFunction(options);
      });

      it('returns with a non-empty path', async () => {
        expect(path).not.toBe('');
      });

      it('does not create a file', async () => {
        await expect(async () => await stat(path)).rejects.toThrow(/ENOENT/);
      });
    });
  });
});
