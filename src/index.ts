import {
    AsyncNamingCallback,
    DirOrFileCallback,
    Options,
    SyncResult
} from './types';

import GarbageCollector from './internal/GarbageCollector';
import {normalizedOsTmpDir} from './internal/PathUtils';

import tmpAsync from './async';
import tmpSync from './sync';

import './internal/InstallListeners';

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
export const tmpdir: string = normalizedOsTmpDir();

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
    return tmpSync.name(options);
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
    return tmpSync.file(options);
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
    return tmpSync.dir(options);
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
    return tmpAsync.name(cb, opts);
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
    return tmpAsync.file((err, result) => {
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
    return tmpAsync.dir((err, result) => {
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
