import {Options} from '..';

import Configuration from './Configuration';
import GarbageCollector from './GarbageCollector';
import PathUtils from './PathUtils';
import TempNameGenerator from './TempNameGenerator';

export default abstract class AbstractInterface {

    private _nameGenerator = new TempNameGenerator();

    public forceClean(): void {
        GarbageCollector.INSTANCE.forceClean = true;
    }

    public get tmpdir(): string {
        return PathUtils.normalizedOsTmpDir;
    }

    public set defaultFileOptions(options: Options) {
        Configuration.defaultFileOptions = options;
    }

    public get defaultFileOptions(): Options {
        return Configuration.defaultFileOptions;
    }

    public set defaultDirOptions(options: Options) {
        Configuration.defaultDirOptions = options;
    }

    public get defaultDirOptions(): Options {
        return Configuration.defaultDirOptions;
    }

    protected generateName(configuration: Configuration): string {
        return this._nameGenerator.generate(configuration);
    }
}
