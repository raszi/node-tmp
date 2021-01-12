import {DirGarbage, Garbage} from './GarbageCollector';
import {exists} from './PathUtils';
import {matchesPrefix, prefixesOnly} from './StringUtils';


export default class GarbagePruner {

    private _dirGarbage: {};
    private _fileGarbage: {};
    private _prunedDirGarbage: DirGarbage[] = [];
    private _prunedFileGarbage: Garbage[] = [];

    public get prunedDirGarbage(): DirGarbage[] {
        return this._prunedDirGarbage;
    }

    public get prunedFileGarbage(): Garbage[] {
        return this._prunedFileGarbage;
    }

    public set dirGarbage(value: {}) {
        this._dirGarbage = value;
    }

    public set fileGarbage(value: {}) {
        this._fileGarbage = value;
    }

    public reset(): void {
        this._dirGarbage = null;
        this._prunedFileGarbage = null;
        this._prunedFileGarbage = null;
        this._prunedFileGarbage = null;
    }

    public prune(): void {

        const potentialDirGarbage: DirGarbage[] = [];
        const potentiallyKeptRoots: Set<string> = new Set<string>();

        // first sweep: identify potentially kept roots, sort out everything that does no longer exist
        for (const key in this._dirGarbage) {
            const garbage: DirGarbage = this._dirGarbage[key];
            // handle cases well where the user (re)moved the directory
            if (exists(garbage.name)) {
                if (garbage.keep) {
                    potentiallyKeptRoots.add(garbage.name);
                }
                potentialDirGarbage.push(garbage);
            }
        }

        // second sweep: identify actual directory garbage
        const keptRoots: string[] = prefixesOnly(potentiallyKeptRoots);
        const dirGarbage: DirGarbage[] = [];
        potentialDirGarbage.forEach((garbage) => {
            if (!matchesPrefix(garbage.name, keptRoots)) {
                dirGarbage.push(garbage);
            }
        });

        // third sweep: identify actual file garbage
        const fileGarbage: Garbage[] = [];
        for (const key in this._fileGarbage) {
            const garbage: Garbage = this._fileGarbage[key];
            if (!garbage.keep) {
                fileGarbage.push(garbage);
            }
        }

        this._prunedDirGarbage = dirGarbage;
        this._prunedFileGarbage = fileGarbage;
    }
}