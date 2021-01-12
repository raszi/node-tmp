import Configuration from '../src/internal/Configuration';
import {exists, isWin32, normalizedOsTmpDir, resolvePath} from '../src/internal/PathUtils';

import * as fs from 'fs';
import * as path from 'path';
import rimraf = require('rimraf');

export function fileExists(name: string): boolean {
    try {
        const stat = fs.statSync(name);
        return stat.isFile();
    } catch (err) {
        console.log(err);
        return false;
    }
}

export function dirExists(name: string): boolean {
    try {
        const stat = fs.statSync(name);
        return stat.isDirectory();
    } catch (err) {
        console.log(err);
        return false;
    }
}

export function notExists(name: string): boolean {
    return !exists(name);
}

export function createTempDir(name: string): void {
    fs.mkdirSync(qualifiedPath(name), Configuration.DEFAULT_DIR_MODE);
}

export function discard(name: string): void {
    rimraf.sync(qualifiedPath(name));
}

export function createTempFile(name: string): void {
    const fd: number = fs.openSync(qualifiedPath(name), Configuration.DEFAULT_FILE_FLAGS, Configuration.DEFAULT_FILE_MODE);
    fs.closeSync(fd);
}

export function qualifiedSubPath(name: string, root: string): string {
    return path.join(root, name);
}

export function qualifiedPath(name: string): string {
    return resolvePath(name, normalizedOsTmpDir());
}

export function nativeRootPath(components: string[]): string {
    if (isWin32) {
        // FIXME this must not be fixed to C:
        return [ 'C:', ...components ].join(path.sep);
    } else {
        // FIXME this must not be fixed to /
        return [ '', ...components ].join(path.sep);
    }
}
