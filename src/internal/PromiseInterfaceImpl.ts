
import {Options, PromiseResult, PromiseInterface} from '..';

import AbstractInterface from './AbstractInterface';
import Configuration from './Configuration';
import PromiseObjectCreator from './PromiseObjectCreator';

export default class PromiseInterfaceImpl extends AbstractInterface implements PromiseInterface {

    private _creator: PromiseObjectCreator = new PromiseObjectCreator();

    public name(options?: Options): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                const configuration = new Configuration(options);
                return resolve(this.generateName(configuration));
            } catch (err) {
                return reject(err);
            }
        });
    }

    public file(options?: Options): Promise<PromiseResult> {
        return new Promise<PromiseResult>((resolve, reject) => {
            try {
                const configuration = new Configuration(options);
                const name = this.generateName(configuration);
                return resolve(this._creator.createFile(name, configuration));
            } catch (err) {
                return reject(err);
            }
        });
    }

    public dir(options?: Options): Promise<PromiseResult> {
        return new Promise<PromiseResult>((resolve, reject) => {
            try {
                const configuration = new Configuration(options);
                const name = this.generateName(configuration);
                return resolve(this._creator.createDir(name, configuration));
            } catch (err) {
                return reject(err);
            }
        });
    }
}
