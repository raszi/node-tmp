import {AsyncCreationCallback} from '../types';

import Configuration from './Configuration';
import GarbageCollector from './GarbageCollector';

import * as fs from 'fs';
import rimraf = require('rimraf');

export default class AsyncObjectCreator {

    public createFile(name: string, configuration: Configuration, callback: AsyncCreationCallback): void {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        fs.open(name, configuration.fileFlags, configuration.fileMode, function(err, fd) {
            if (err) {
                return callback(err);
            } else {
                GarbageCollector.INSTANCE.registerFile(name, configuration);

                return fs.close(fd, (err) => {
                    if (err) {
                        return callback(err);
                    } else {
                        return callback(null, {
                            name,
                            dispose: (next?: (err?: Error) => void) => {
                                const callback = (err?) => {
                                    GarbageCollector.INSTANCE.unregisterObject(name);
                                    /* istanbul ignore else */
                                    if (next) {
                                        return next(err);
                                    }
                                };
                                if (fs.existsSync(name)) {
                                    return fs.unlink(name, callback);
                                } else {
                                    return callback();
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    public createDir(name: string, configuration: Configuration, callback: AsyncCreationCallback): void {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        fs.mkdir(name, configuration.dirMode, function(err, _) {
            if (err) {
                return callback(err);
            } else {
                GarbageCollector.INSTANCE.registerDir(name, configuration);

                return callback(null, {
                    name,
                    dispose: (next?: (err?) => void) => {
                        const callback = (err?) => {
                            GarbageCollector.INSTANCE.unregisterObject(name);
                            /* istanbul ignore else */
                            if (next) {
                                return next(err);
                            }
                        };
                        if (fs.existsSync(name)) {
                            if (GarbageCollector.INSTANCE.forceClean || configuration.forceClean) {
                                return rimraf(name, callback);
                            } else {
                                return fs.rmdir(name, callback);
                            }
                        } else {
                            return callback();
                        }
                    }
                });
            }
        });
    }
}
