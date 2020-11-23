import {Options, SyncInterface, SyncResult} from '..';

import AbstractInterfaceBase from './AbstractInterfaceBase';
import Configuration from './Configuration';
import SyncObjectCreator from './SyncObjectCreator';

export default class SyncInterfaceImpl extends AbstractInterfaceBase implements SyncInterface {

    private _creator = new SyncObjectCreator();

    public name(options?: Options): string {
        const configuration = new Configuration(options);
        return this.generateName(configuration);
    }

    public file(options?: Options): SyncResult {
        const configuration = new Configuration(options);
        const name = this.generateName(configuration);
        return this._creator.createFile(name, configuration);
    }

    public dir(options?: Options): SyncResult {
        const configuration = new Configuration(options);
        const name = this.generateName(configuration);
        return this._creator.createDir(name, configuration);
    }
}
