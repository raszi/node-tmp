import { stat } from 'fs/promises';

import { createEntry } from './creator';
import { Options } from './types';

const isError = (e: unknown): e is Error => {
  return e !== null && typeof e === 'object' && Object.prototype.hasOwnProperty.call(e, 'code');
};

export async function create(options: Options = {}): Promise<string> {
  return createEntry(options, async (path) => {
    try {
      await stat(path);

      return false;
    } catch (e) {
      return isError(e) && e.message.match(/ENOENT/) ? true : false;
    }
  });
}
