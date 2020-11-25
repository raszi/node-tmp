import Configuration from './Configuration';
import GarbageDisposer from './GarbageDisposer';
import GarbagePruner from './GarbagePruner';
import PathUtils from './PathUtils';
import StringUtils from './StringUtils';

export interface Garbage {
    name: string;
    keep: boolean;
}

export interface DirGarbage extends Garbage {
    forceClean: boolean;
    garbage: {};
}

export default class GarbageCollector {

    private _forceClean: boolean = false;

    private _branches: Set<string> = new Set<string>();
    private _leaves: Set<string> = new Set<string>();
    private _dirGarbage: {} = {};
    private _fileGarbage: {} = {};

    private _pruner: GarbagePruner = new GarbagePruner();
    private _disposer: GarbageDisposer = new GarbageDisposer();

    // TODO:make this testable
    public static INSTANCE: GarbageCollector = new GarbageCollector();

    private constructor() {
    }

    public registerDir(name: string, configuration: Configuration): void {
        this._branches.add(name);
        this._dirGarbage[name] = {
            name,
            keep: configuration.keep,
            forceClean: configuration.forceClean,
            garbage: []
        };
    }

    public isRegisteredObject(name): boolean {
        return this._leaves.has(name) || this._branches.has(name);
    }

    public registerFile(name: string, configuration: Configuration): void {
        const root: string = StringUtils.determinePrefix(name, StringUtils.rsort(this._branches));
        this._leaves.add(name);
        const garbage: Garbage = {
            name,
            keep: configuration.keep
        };
        if (root === name) {
            this._fileGarbage[name] = garbage;
        } else {
            // keep tmp files created by the user together with the tmp dirs that the user created
            // to make it easier for us during waste disposal
            this._dirGarbage[root].garbage[garbage.name] = garbage;
        }
    }

    public unregisterObject(name: string): void {
        /* istanbul ignore else */
        if (this.isRegisteredObject(name)) {
            /* istanbul ignore else */
            if (this._leaves.has(name)) {
                this.unregisterFile(name);
            } else if (this._branches.has(name)) {
                this.unregisterDir(name);
            }
        }
    }

    private unregisterDir(name: string): void {
        // collect all other subdir garbage as well
        const collectedBranches: string[] = [];
        collectedBranches.push(name);
        this._branches.forEach((branch) => {
            /* istanbul ignore else */
            if (PathUtils.isRelative(branch, name)) {
                collectedBranches.push(branch);
            }
        });
        const collectedLeaves: string[] = [];
        this._leaves.forEach((leaf) =>{
            /* istanbul ignore else */
           if (PathUtils.isRelative(leaf, name)) {
               collectedLeaves.push(leaf);
           }
        });
        collectedBranches.forEach((name) => {
            this._branches.delete(name);
            delete this._dirGarbage[name];
        });
        collectedLeaves.forEach((name) => {
            this._leaves.delete(name);
        });
    }

    private unregisterFile(name: string): void {
        const root: string = StringUtils.determinePrefix(name, StringUtils.rsort(this._branches));
        if (this._branches.has(root)) {
            delete this._dirGarbage[root].garbage[name];
        } else {
            delete this._fileGarbage[name];
        }
        this._leaves.delete(name);
    }

    public dispose(): void {
        this._pruner.reset();
        this._pruner.dirGarbage = this._dirGarbage;
        this._pruner.fileGarbage = this._fileGarbage;
        this._pruner.prune();
        this._disposer.disposeDirGarbage(this._pruner.prunedDirGarbage);
        this._disposer.disposeFileGarbage(this._pruner.prunedFileGarbage);
        this._branches = new Set<string>();
        this._leaves = new Set<string>();
        this._dirGarbage = {};
        this._fileGarbage = [];
    }

    public get forceClean() {
        return this._forceClean;
    }

    public set forceClean(value: boolean) {
        this._forceClean = value;
    }
}
