import {
    Options,
    SyncInterface,
    SyncResult
} from './types';

import SyncInterfaceImpl from './internal/SyncInterfaceImpl';

import './internal/InstallListeners';

const instance : SyncInterface = new SyncInterfaceImpl();

/**
 * This is the singleton instance of the {@link SyncInterface}.
 *
 * @public
 *
 * @example
 * import tmp from 'tmp/sync';
 *
 * @example
 * const tmp = require('tmp/sync');
 *
 * @category Interfaces / Sync
 */
export default instance;

/**
 * This is a convenience wrapper for {@link SyncInterface#file}.
 *
 * @public
 *
 * @example
 * import file from 'tmp/sync';
 *
 * @example
 * const file = require('tmp/sync').file;
 *
 * @category Interfaces / Sync
 */
export function file(options?: Options): SyncResult {
    return instance.file(options);
}

/**
 * This is a convenience wrapper for {@link SyncInterface#dir}.
 *
 * @public
 *
 * @example
 * import dir from 'tmp/sync';
 *
 * @example
 * const dir = require('tmp/sync').dir;
 *
 * @category Interfaces / Sync
 */
export function dir(options?: Options): SyncResult {
    return instance.dir(options);
}

/**
 * This is a convenience wrapper for {@link SyncInterface#name}.
 *
 * @public
 *
 * @example
 * import name from 'tmp/sync';
 *
 * @example
 * const name = require('tmp/sync').name;
 *
 * @category Interfaces / Sync
 */
export function name(options?: Options): string {
    return instance.name(options);
}

/**
 * This is a convenience wrapper for {@link SyncInterface#forceClean}.
 *
 * @public
 *
 * @example
 * import forceClean from 'tmp/sync';
 *
 * @example
 * const forceClean = require('tmp/sync').forceClean;
 *
 * @category Interfaces / Sync
 */
export function forceClean(): void {
    instance.forceClean();
}
