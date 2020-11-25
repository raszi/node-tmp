import {BaseInterface, Options} from '../types';

import Configuration from './Configuration';
import GarbageCollector from './GarbageCollector';
import PathUtils from './PathUtils';
import TempNameGenerator from './TempNameGenerator';

export default abstract class AbstractInterfaceBase implements BaseInterface {

    private _nameGenerator = new TempNameGenerator();

    public forceClean(): void {
        GarbageCollector.INSTANCE.forceClean = true;
    }

    public get tmpdir(): string {
        return PathUtils.normalizedOsTmpDir;
    }

    public set defaultOptions(options: Options) {
        Configuration.defaultOptions = options;
    }

    public get defaultOptions(): Options {
        return Configuration.defaultOptions;
    }

    protected generateName(configuration: Configuration): string {
        return this._nameGenerator.generate(configuration);
    }
}
