import { O_CREAT, O_EXCL } from 'constants';
import { Mode } from 'fs';
import { open } from 'fs/promises';

import { createEntry } from './creator';
import { CallbackFunction, Options } from './types';
import { optionalCallback } from './utils';

export type CreateOptions = Options & {
  mode?: Mode;
};

const fileMode = 0o600;
const createFlags = O_CREAT | O_EXCL;

async function create(options?: CreateOptions): Promise<string>;
async function create(options?: CreateOptions, cb?: CallbackFunction<string>): Promise<void>;

async function create({ mode, ...options }: CreateOptions = {}, cb?: CallbackFunction<string>): Promise<void | string> {
  const createFile = createEntry(options, async (path) => {
    try {
      const fileHandle = await open(path, createFlags, mode || fileMode);
      await fileHandle.close();

      return true;
    } catch {
      return false;
    }
  });

  return optionalCallback(createFile, cb);
}

export { create };
