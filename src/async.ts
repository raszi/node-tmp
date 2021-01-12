import {
    AsyncCreationCallback,
    AsyncInterface,
    AsyncNamingCallback,
    Options,
} from './types';

import AsyncInterfaceImpl from './internal/AsyncInterfaceImpl';

import './internal/InstallListeners';

const instance : AsyncInterface = new AsyncInterfaceImpl();

/**
 * This is the singleton instance of the {@link AsyncInterface}.
 *
 * @public
 *
 * @example
 * import tmp from 'tmp/async';
 *
 * @example
 * const tmp = require('tmp/async');
 *
 * @category Interfaces / Async
 */
export default instance;

/**
 * This is a convenience wrapper for {@link AsyncInterface#file}.
 *
 * @public
 *
 * @example
 * import file from 'tmp/async';
 *
 * @example
 * const file = require('tmp/async').file;
 *
 * @category Interfaces / Async
 */
export function file(callback: AsyncCreationCallback, options?: Options): void {
    return instance.file(callback, options);
}

/**
 * This is a convenience wrapper for {@link AsyncInterface#dir}.
 *
 * @public
 *
 * @example
 * import dir from 'tmp/async';
 *
 * @example
 * const dir = require('tmp/async').dir;
 *
 * @category Interfaces / Async
 */
export function dir(callback: AsyncCreationCallback, options?: Options): void {
    return instance.dir(callback, options);
}

/**
 * This is a convenience wrapper for {@link AsyncInterface#name}.
 *
 * @public
 *
 * @example
 * import name from 'tmp/async';
 *
 * @example
 * const name = require('tmp/async').name;
 *
 * @category Interfaces / Async
 */
export function name(callback: AsyncNamingCallback, options?: Options): void {
    return instance.name(callback, options);
}

/**
 * This is a convenience wrapper for {@link AsyncInterface#forceClean}.
 *
 * @public
 *
 * @example
 * import forceClean from 'tmp/async';
 *
 * @example
 * const forceClean = require('tmp/async').forceClean;
 *
 * @category Interfaces / Async
 */
export function forceClean(): void {
    instance.forceClean();
}
