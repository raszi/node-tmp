import { CallbackFunction } from 'types';

export async function optionalCallback<T>(promise: Promise<T>, callback?: CallbackFunction<T>): Promise<void | T> {
  if (!callback) {
    return promise;
  }

  promise.then((value: T) => callback(undefined, value)).catch(callback);
}
