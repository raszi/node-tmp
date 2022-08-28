import { basename, dirname } from 'path';

import { createEntry } from '../creator';

const constantly = <T>(value: T) => {
  return () => value;
};

describe('createEntry()', () => {
  it('throws an error when maximum tries reached', async () => {
    await expect(async () => await createEntry({}, constantly(false))).rejects.toThrowError(/^Maximum tries reached/);
  });

  it('returns a random name with the dir when providing a dir', async () => {
    const path = await createEntry({ dir: 'something' }, constantly(true));

    const actual = basename(dirname(path));

    expect(actual).toEqual('something');
  });

  it('throws an error when the tries are not enough', async () => {
    await expect(async () => await createEntry({ tries: 0 }, constantly(true))).rejects.toThrowError(
      /^Maximum tries reached/
    );
  });
});
