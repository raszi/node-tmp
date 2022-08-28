import { stat, unlink } from 'fs/promises';
import { platform } from 'os';

import { CreateOptions, create } from '../file';

const cases: [string, CreateOptions | undefined][] = [
  ['undefined', undefined],
  ['empty options', {}],
  ['template', { template: 'foo-XXXXXX-bar' }],
  ['prefix', { prefix: 'something' }],
  ['postfix', { postfix: '.tmp' }],
  ['fixed name', { name: 'fixed' }],
  ['predefined mode', { mode: 0o640 }],
];

describe.each(cases)('create()', (description, options) => {
  describe(`with ${description}`, () => {
    let path: string;

    beforeEach(async () => {
      path = await create(options);
    });

    afterEach(async () => path && unlink(path));

    it('returns with a non-empty path', async () => {
      expect(path).not.toBe('');
    });

    it('creates a new empty file as requested', async () => {
      const actual = await stat(path);

      expect(actual.isFile()).toBe(true);

      expect(actual.size).toEqual(0);

      // Due to a libuv issue this check is disabled on Windows paltforms
      // https://github.com/nodejs/node-v0.x-archive/issues/4812
      if (platform().startsWith('win')) {
        return;
      }

      const mode = options?.mode || 0o600;
      expect(actual.mode.toString(8).slice(-3)).toEqual(mode.toString(8));
    });
  });
});
