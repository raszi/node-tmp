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

const createFile = (mode: Mode) => {
  return async (path: string): Promise<boolean> => {
    try {
      const fileHandle = await open(path, createFlags, mode);
      await fileHandle.close();

      return true;
    } catch {
      return false;
    }
  };
};

async function create(options?: CreateOptions): Promise<string>;
async function create(options?: CreateOptions, cb?: CallbackFunction<string>): Promise<void>;

async function create({ mode, ...options }: CreateOptions = {}, cb?: CallbackFunction<string>): Promise<void | string> {
  const createPromise = createEntry(options, createFile(mode || fileMode));

  return optionalCallback(createPromise, cb);
}

export { create };
