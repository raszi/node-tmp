import {
    Options,
    PromiseInterface,
    PromiseResult
} from './types';

import PromiseInterfaceImpl from './internal/PromiseInterfaceImpl';

import './internal/InstallListeners';

const instance : PromiseInterface = new PromiseInterfaceImpl();

/**
 * This is the singleton instance of the {@link PromiseInterface}.
 *
 * @public
 *
 * @example
 * import tmp from 'tmp/promise';
 *
 * @example
 * const tmp = require('tmp/promise');
 *
 * @category Interfaces / Promise
 */
export default instance;

/**
 * This is a convenience wrapper for {@link PromiseInterface#file}.
 *
 * @public
 *
 * @example
 * import file from 'tmp/promise';
 *
 * @example
 * const file = require('tmp/promise').file;
 *
 * @category Interfaces / Promise
 */
export function file(options?: Options): Promise<PromiseResult> {
    return instance.file(options);
}

/**
 * This is a convenience wrapper for {@link PromiseInterface#dir}.
 *
 * @public
 *
 * @example
 * import dir from 'tmp/promise';
 *
 * @example
 * const dir = require('tmp/promise').dir;
 *
 * @category Interfaces / Promise
 */
export function dir(options?: Options): Promise<PromiseResult> {
    return instance.dir(options);
}

/**
 * This is a convenience wrapper for {@link PromiseInterface#name}.
 *
 * @public
 *
 * @example
 * import name from 'tmp/promise';
 *
 * @example
 * const name = require('tmp/promise').name;
 *
 * @category Interfaces / Promise
 */
export function name(options?: Options): Promise<string> {
    return instance.name(options);
}

/**
 * This is a convenience wrapper for {@link PromiseInterface#forceClean}.
 *
 * @public
 *
 * @example
 * import forceClean from 'tmp/promise';
 *
 * @example
 * const forceClean = require('tmp/promise').forceClean;
 *
 * @category Interfaces / Promise
 */
export function forceClean(): void {
    instance.forceClean();
}
