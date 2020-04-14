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

    protected configure(options: Options, defaultMode: number = 0o000): Configuration {
        return new Configuration(options, defaultMode);
    }

    protected generateName(configuration: Configuration): string {
        return this._nameGenerator.generate(configuration);
    }
}
