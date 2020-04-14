import {AsyncCreationCallback, AsyncInterface, AsyncNamingCallback, Options} from '..';

import AbstractInterface from './AbstractInterface';
import AsyncObjectCreator from './AsyncObjectCreator';
import Configuration from './Configuration';

export default class AsyncInterfaceImpl extends AbstractInterface implements AsyncInterface {

    private _creator = new AsyncObjectCreator();

    public name(callback: AsyncNamingCallback, options?: Options) {
        try {
            const configuration = this.configure(options);
            return callback(null, this.generateName(configuration));
        } catch (err) {
            return callback(err);
        }
    }

    public file(callback: AsyncCreationCallback, options?: Options) {
        try {
            const configuration = this.configure(options, Configuration.DEFAULT_FILE_MODE);
            const name = this.generateName(configuration);
            return this._creator.createFile(name, configuration, callback);
        } catch (err) {
            return callback(err);
        }
    }

    public dir(callback: AsyncCreationCallback, options?: Options) {
        try {
            const configuration = this.configure(options, Configuration.DEFAULT_DIR_MODE);
            const name = this.generateName(configuration);
            return this._creator.createDir(name, configuration, callback);
        } catch (err) {
            return callback(err);
        }
    }
}