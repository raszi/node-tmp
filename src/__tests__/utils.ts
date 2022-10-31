import { CallbackFunction } from '../types';

export type TestCase<T> = [string, T | undefined];

type CreateFunction<T> = (options: T | undefined, cb: CallbackFunction<string>) => Promise<void>;

const callbackWrapper = <T>(create: CreateFunction<T>) => {
  return (options?: T): Promise<string> =>
    new Promise((resolve, reject) => {
      create(options, (err, path) => {
        if (err) {
          return reject(err);
        }

        if (!path) {
          return reject('Illegal state, the value is not present');
        }

        resolve(path);
      });
    });
};

export const withCallbackWrapper = <T>(testCases: TestCase<T>[]) =>
  [
    [null, testCases],
    [callbackWrapper<T>, testCases],
  ] as const;
