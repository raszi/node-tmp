import { stat } from 'fs/promises';

import { create } from '../name';
import { Options } from '../types';

const cases: [string, Options | undefined][] = [
  ['undefined', undefined],
  ['empty options', {}],
  ['template', { template: 'foo-XXXXXX-bar' }],
  ['prefix', { prefix: 'something' }],
  ['postfix', { postfix: '.tmp' }],
  ['fixed name', { name: 'fixed' }],
];

describe.each(cases)('create()', (description, options) => {
  describe(`with ${description}`, () => {
    let path: string;

    beforeEach(async () => {
      path = await create(options);
    });

    it('returns with a non-empty path', async () => {
      expect(path).not.toBe('');
    });

    it('does not create a file', async () => {
      await expect(async () => await stat(path)).rejects.toThrowError(/ENOENT/);
    });
  });
});
