import {PromiseResult} from '..';

import Configuration from './Configuration';
import GarbageCollector from './GarbageCollector';

import * as fs from 'fs';
import {promises as pfs} from 'fs';
import * as rmfr from 'rmfr';

export default class PromiseObjectCreator {

    public createFile(name: string, configuration: Configuration): Promise<PromiseResult> {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        return pfs.open(name, configuration.fileFlags, configuration.fileMode)
            .then((fileHandle) => {
                return fileHandle.close();
            })
            .then(() => {
                GarbageCollector.INSTANCE.registerFile(name, configuration);

                return {
                    name,
                    dispose: (): Promise<void> => {
                        if (fs.existsSync(name)) {
                            return pfs.unlink(name).finally(() => {
                                GarbageCollector.INSTANCE.unregisterObject(name);
                            });
                        } else {
                            GarbageCollector.INSTANCE.unregisterObject(name);
                            return Promise.resolve();
                        }
                    }
                };
            });
    }

    public createDir(name: string, configuration: Configuration): Promise<PromiseResult> {
        // the user may have forgotten to dispose the object or just moved the object and did no longer care
        // either case we must try to unregister the object first
        GarbageCollector.INSTANCE.unregisterObject(name);

        return pfs.mkdir(name, configuration.dirMode)
            .then(() => {
                GarbageCollector.INSTANCE.registerDir(name, configuration);

                return {
                    name,
                    dispose: (): Promise<void> => {
                        if (fs.existsSync(name)) {
                            if (GarbageCollector.INSTANCE.forceClean || configuration.forceClean) {
                                return rmfr(name).finally(() => {
                                    GarbageCollector.INSTANCE.unregisterObject(name);
                                });
                            } else {
                                return pfs.rmdir(name).finally(() => {
                                    GarbageCollector.INSTANCE.unregisterObject(name);
                                });
                            }
                        } else {
                            GarbageCollector.INSTANCE.unregisterObject(name);
                            return Promise.resolve();
                        }
                    }
                };
            });
    }
}
