import { readdir, rmdir, stat } from 'fs/promises';
import { platform } from 'os';

import { CreateOptions, create } from '../dir';

const cases: [string, CreateOptions | undefined][] = [
  ['undefined', undefined],
  ['empty options', {}],
  ['template', { template: 'foo-XXXXXX-bar' }],
  ['prefix', { prefix: 'something' }],
  ['postfix', { postfix: '.tmp' }],
  ['fixed name', { name: 'fixed' }],
  ['predefined mode', { mode: 0o711 }],
];

describe.each(cases)('create()', (description, options) => {
  describe(`with ${description}`, () => {
    let path: string;

    beforeEach(async () => {
      path = await create(options);
    });

    afterEach(async () => path && rmdir(path));

    it('returns with a non-empty path', async () => {
      expect(path).not.toBe('');
    });

    it('creates a empty directory as requested', async () => {
      const actual = await stat(path);

      expect(actual.isDirectory()).toBe(true);

      const files = await readdir(path);
      expect(files).toEqual([]);

      // Due to a libuv issue this check is disabled on Windows paltforms
      // https://github.com/nodejs/node-v0.x-archive/issues/4812
      if (platform().startsWith('win')) {
        return;
      }

      const mode = options?.mode || 0o700;
      expect(actual.mode.toString(8).slice(-3)).toEqual(mode.toString(8));
    });
  });
});
