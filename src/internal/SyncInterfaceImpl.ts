import {Options, SyncInterface, SyncResult} from '..';

import AbstractInterface from './AbstractInterface';
import Configuration from './Configuration';
import SyncObjectCreator from './SyncObjectCreator';

export default class SyncInterfaceImpl extends AbstractInterface implements SyncInterface {

    private _creator = new SyncObjectCreator();

    public name(options?: Options): string {
        const configuration = this.configure(options);
        return this.generateName(configuration);
    }

    public file(options?: Options): SyncResult {
        const configuration = this.configure(options, Configuration.DEFAULT_FILE_MODE);
        const name = this.generateName(configuration);
        return this._creator.createFile(name, configuration);
    }

    public dir(options?: Options): SyncResult {
        const configuration = this.configure(options, Configuration.DEFAULT_DIR_MODE);
        const name = this.generateName(configuration);
        return this._creator.createDir(name, configuration);
    }
}
