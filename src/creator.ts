import { tmpdir as osTmpDir } from 'os';
import { join } from 'path';

import { initGenerator } from './generator';
import { OptionalAsyncFunction, Options } from './types';

type CreateFunction = OptionalAsyncFunction<string, boolean>;

const getTmpDir = (tmpDir?: string): string => tmpDir || osTmpDir();

const defaultMaxTries = 3;

export async function createEntry({ dir, tries, ...options }: Options, create: CreateFunction): Promise<string> {
  const maxTries = tries === undefined ? defaultMaxTries : tries;
  const generate = initGenerator(options);
  const tmpDir = getTmpDir(options.tmpdir);

  for (let i = 0; i < maxTries; i++) {
    const name = generate();
    const path = dir ? join(tmpDir, dir, name) : join(tmpDir, name);

    const returnValue = create(path);

    const success = returnValue instanceof Promise ? await returnValue : returnValue;

    if (success) {
      return path;
    }
  }

  throw new Error(`Maximum tries reached ${maxTries}`);
}
