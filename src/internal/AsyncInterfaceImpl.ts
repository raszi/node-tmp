import {AsyncCreationCallback, AsyncInterface, AsyncNamingCallback, Options} from '../types';

import AbstractInterfaceBase from './AbstractInterfaceBase';
import AsyncObjectCreator from './AsyncObjectCreator';
import Configuration from './Configuration';

export default class AsyncInterfaceImpl extends AbstractInterfaceBase implements AsyncInterface {

    private _creator = new AsyncObjectCreator();

    public name(callback: AsyncNamingCallback, options?: Options) {
        try {
            const configuration = new Configuration(options);
            return callback(null, this.generateName(configuration));
        } catch (ex) {
            return callback(ex, null);
        }
    }

    public file(callback: AsyncCreationCallback, options?: Options) {
        try {
            const configuration = new Configuration(options);
            const name = this.generateName(configuration);
            return this._creator.createFile(name, configuration, callback);
        } catch (ex) {
            return callback(ex, null);
        }
    }

    public dir(callback: AsyncCreationCallback, options?: Options) {
        try {
            const configuration = new Configuration(options);
            const name = this.generateName(configuration);
            return this._creator.createDir(name, configuration, callback);
        } catch (ex) {
            return callback(ex, null);
        }
    }
}