import { O_CREAT, O_EXCL } from 'constants';
import { Mode } from 'fs';
import { open } from 'fs/promises';

import { createEntry } from './creator';
import { Options } from './types';

export type CreateOptions = Options & {
  mode?: Mode;
};

const fileMode = 0o600;
const createFlags = O_CREAT | O_EXCL;

export async function create({ mode, ...options }: CreateOptions = {}): Promise<string> {
  return createEntry(options, async (path) => {
    try {
      const fileHandle = await open(path, createFlags, mode || fileMode);
      await fileHandle.close();

      return true;
    } catch {
      return false;
    }
  });
}
