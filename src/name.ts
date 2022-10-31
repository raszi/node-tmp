import { stat } from 'fs/promises';

import { createEntry } from './creator';
import { CallbackFunction, Options } from './types';
import { optionalCallback } from './utils';

const isError = (e: unknown): e is Error => {
  return e !== null && typeof e === 'object' && Object.prototype.hasOwnProperty.call(e, 'code');
};

const pathAvailable = async (path: string): Promise<boolean> => {
  try {
    await stat(path);

    return false;
  } catch (e) {
    return isError(e) && e.message.match(/ENOENT/) ? true : false;
  }
};

async function create(options?: Options): Promise<string>;
async function create(options?: Options, cb?: CallbackFunction<string>): Promise<void>;

async function create(options: Options = {}, cb?: CallbackFunction<string>): Promise<void | string> {
  const createPromise = createEntry(options, pathAvailable);

  return optionalCallback(createPromise, cb);
}

export { create };
