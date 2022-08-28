import { MakeDirectoryOptions } from 'fs';
import { mkdir } from 'fs/promises';

import { createEntry } from './creator';
import { Options } from './types';

export type CreateOptions = Options & MakeDirectoryOptions;

const dirMode = 0o700;

export async function create(options: CreateOptions = {}): Promise<string> {
  return createEntry(options, async (path) => {
    try {
      await mkdir(path, { mode: dirMode, ...options });
      return true;
    } catch {
      return false;
    }
  });
}
