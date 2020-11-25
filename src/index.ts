import {
    AsyncInterface,
    AsyncNamingCallback,
    DirOrFileCallback,
    Options,
    PromiseInterface,
    SyncInterface,
    SyncResult
} from './types';

import AsyncInterfaceImpl from './internal/AsyncInterfaceImpl';
import PromiseInterfaceImpl from './internal/PromiseInterfaceImpl';
import SyncInterfaceImpl from './internal/SyncInterfaceImpl';

import GarbageCollector from './internal/GarbageCollector';
import PathUtils from './internal/PathUtils';

/**
 * This is the singleton instance of the {@link SyncInterface}.
 *
 * @public
 *
 * @example
 * import {sync as tmp} from 'tmp';
 *
 * @example
 * const tmp = require('tmp').sync;
 *
 * @category Interfaces / Sync
 */
export const sync : SyncInterface = new SyncInterfaceImpl();

/**
 * This is the singleton instance of the {@link AsyncInterface}.
 *
 * @example
 * import {async as tmp} from 'tmp';
 *
 * @example
 * const tmp = require('tmp').async;
 *
 * @category Interfaces / Async
 */
export const async : AsyncInterface = new AsyncInterfaceImpl();

/**
 * This is the singleton instance of the {@link PromiseInterface}.
 *
 * @example
 * import {promise as tmp} from 'tmp';
 *
 * @example
 * const tmp = require('tmp').promise;
 *
 * @category Interfaces / Promise
 */
export const promise : PromiseInterface = new PromiseInterfaceImpl();

/**
 * @function
 *
 * @deprecated this will be removed in v1.0.0, use (sync|async|promise).forceClean() instead.
 *
 * @category Tmp Legacy Interface
 */
export function setGracefulCleanup() {
    GarbageCollector.INSTANCE.forceClean = true;
}

/**
 * @member {string}
 *
 * @deprecated this will be removed in v1.0.0, use (sync|async|promise).tmpdir instead.
 *
 * @category Tmp Legacy Interface
 */
export const tmpdir: string = PathUtils.normalizedOsTmpDir;

/**
 * @function
 * @param {Options} options
 * @returns {string}
 *
 * @deprecated this will be removed in v1.0.0, use sync.name() instead
 *
 * @category Tmp Legacy Interface
 */
export function tmpNameSync(options: Options = {}): string {
    return sync.name(options);
}

/**
 * @function
 * @param {Options} options
 * @returns {SyncResult}
 *
 * @deprecated this will be removed in v1.0.0, use #sync.file() instead
 *
 * @category Tmp Legacy Interface
 */
export function fileSync(options: Options = {}): SyncResult {
    return sync.file(options);
}

/**
 * @function
 * @param {Options} options
 * @returns {SyncResult}
 *
 * @deprecated this will be removed in v1.0.0, use sync.dir() instead
 *
 * @category Tmp Legacy Interface
 */
export function dirSync(options: Options = {}): SyncResult {
    return sync.dir(options);
}

/**
 * @function
 * @param {Options | AsyncNamingCallback} callbackOrOptions
 * @param {AsyncNamingCallback?} callback
 *
 * @deprecated this will be removed in v1.0.0, use async.name() instead
 *
 * @category Tmp Legacy Interface
 */
export function tmpName(callbackOrOptions: Options | AsyncNamingCallback, callback?: AsyncNamingCallback): void {
    const [opts, cb] = _parseArguments(callbackOrOptions, callback);
    return async.name(cb, opts);
}

/**
 * @function
 * @param {Options | DirOrFileCallback} callbackOrOptions
 * @param {DirOrFileCallback?} callback
 *
 * @deprecated this will be removed in v1.0.0, use async.file() instead
 *
 * @category Tmp Legacy Interface
 */
export function file(callbackOrOptions: Options | DirOrFileCallback, callback?: DirOrFileCallback): void {
    const [opts, cb] = _parseArguments(callbackOrOptions, callback);
    return async.file((err, result) => {
        if (err) {
            return cb(err);
        } else {
            return cb(null, result.name, result.dispose);
        }
    }, opts);
}

/**
 * @function
 * @param {Options | DirOrFileCallback} callbackOrOptions
 * @param {DirOrFileCallback?} callback
 *
 * @deprecated this will be removed in v1.0.0, use async.dir() instead
 *
 * @category Tmp Legacy Interface
 */
export function dir(callbackOrOptions: Options | DirOrFileCallback, callback?: DirOrFileCallback): void {
    const [opts, cb] = _parseArguments(callbackOrOptions, callback);
    return async.dir((err, result) => {
        if (err) {
            return cb(err);
        } else {
            return cb(null, result.name, result.dispose);
        }
    }, opts);
}

/**
 * Parses the arguments.
 *
 * @private
 * @function
 * @param {(Options|null|undefined|Function)} callbackOrOptions
 * @param {?Function} callback
 * @returns {Array} parsed arguments
 *
 * @deprecated this will be removed in v1.0.0
 */
function _parseArguments(callbackOrOptions, callback) {
    if (typeof callbackOrOptions === 'function') {
        return [callback, callbackOrOptions];
    } else {
        return [callbackOrOptions, callback];
    }
}

/**
 * Process exit listener.
 *
 * This gets installed by default in order to make sure that all remaining garbage will be removed on process exit.
 *
 * Note that if a process keeps an active lock on any of the temporary objects created by tmp, then these objects
 * will remain in place and cannot be removed.
 *
 * Note also, that for all file and directory objects that have been configured for {@link Options#keep}ing but which
 * are children of a temporary directory that can be removed by tmp, especially when the {@link Options#forceClean}
 * option has been set, then these objects will be removed as well.
 *
 * In order to clean up on SIGINT, e.g. CTRL-C, you will have to install a handler yourself, see the below example.
 *
 * @example
 * process.on('SIGINT', process.exit);
 *
 * @function exit_listener
 * @protected
 *
 * @category Installed Listeners
 */
process.on('exit', function () {
    GarbageCollector.INSTANCE.dispose();
});
