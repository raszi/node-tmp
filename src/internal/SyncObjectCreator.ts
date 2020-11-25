import {SyncResult} from '../types';

import Configuration from './Configuration';
import GarbageCollector from './GarbageCollector';

import * as fs from 'fs';
import rimraf = require('rimraf');

export default class SyncObjectCreator {

    public createFile(name: string, configuration: Configuration): SyncResult {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        const fd: number = fs.openSync(name, configuration.fileFlags, configuration.fileMode);
        fs.closeSync(fd);

        function disposeFunction() {
            try {
                /* istanbul ignore else */
                if (fs.existsSync(name)) {
                    fs.unlinkSync(name);
                }
            } finally {
                GarbageCollector.INSTANCE.unregisterObject(name);
            }
        }

        GarbageCollector.INSTANCE.registerFile(name, configuration);
        return {
            name,
            // TODO:1.0.0:deprecated
            removeCallback: disposeFunction,
            dispose: disposeFunction
        };
    }

    public createDir(name: string, configuration: Configuration): SyncResult {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        fs.mkdirSync(name, configuration.dirMode);

        function disposeFunction() {
            try {
                /* istanbul ignore else */
                if (fs.existsSync(name)) {
                    if (GarbageCollector.INSTANCE.forceClean || configuration.forceClean) {
                        rimraf.sync(name);
                    } else {
                        fs.rmdirSync(name);
                    }
                }
            } finally {
                GarbageCollector.INSTANCE.unregisterObject(name);
            }
        }

        GarbageCollector.INSTANCE.registerDir(name, configuration);
        return {
            name,
            // TODO:1.0.0:deprecated
            removeCallback: disposeFunction,
            dispose: disposeFunction
        };
    }
}
