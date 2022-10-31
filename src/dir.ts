import { MakeDirectoryOptions } from 'fs';
import { mkdir } from 'fs/promises';

import { createEntry } from './creator';
import { CallbackFunction, Options } from './types';
import { optionalCallback } from './utils';

export type CreateOptions = Options & MakeDirectoryOptions;

const dirMode = 0o700;

async function create(options?: CreateOptions): Promise<string>;
async function create(options?: CreateOptions, cb?: CallbackFunction<string>): Promise<void>;

async function create(options: CreateOptions = {}, cb?: CallbackFunction<string>): Promise<void | string> {
  const createDir = createEntry(options, async (path) => {
    try {
      await mkdir(path, { mode: dirMode, ...options });
      return true;
    } catch {
      return false;
    }
  });

  return optionalCallback(createDir, cb);
}

export { create };
