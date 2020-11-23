import Configuration from '../src/internal/Configuration';
import PathUtils from '../src/internal/PathUtils';

import * as fs from 'fs';
import * as path from 'path';
import rimraf = require('rimraf');

export default class TestUtils {
    public static fileExists(name: string): boolean {
        try {
            const stat = fs.statSync(name);
            return stat.isFile();
        } catch (err) {
            return false;
        }
    }

    public static dirExists(name: string): boolean {
        try {
            const stat = fs.statSync(name);
            return stat.isDirectory();
        } catch (err) {
            return false;
        }
    }

    public static createTempDir(name: string): void {
        fs.mkdirSync(this.qualifiedPath(name), Configuration.DEFAULT_DIR_MODE);
    }

    public static discard(name: string): void {
        rimraf.sync(this.qualifiedPath(name));
    }

    public static createTempFile(name: string): void {
        const fd: number = fs.openSync(this.qualifiedPath(name), Configuration.DEFAULT_FILE_FLAGS, Configuration.DEFAULT_FILE_MODE);
        fs.closeSync(fd);
    }

    public static qualifiedSubPath(name: string, root: string): string {
        return path.join(root, name);
    }

    public static qualifiedPath(name: string): string {
        return PathUtils.resolvePath(name, PathUtils.normalizedOsTmpDir);
    }

    public static nativeRootPath(components: string[]): string {
        if (PathUtils.isWin32) {
            // FIXME this must not be fixed to C:
            return [ 'C:', ...components ].join(path.sep);
        } else {
            // FIXME this must not be fixed to /
            return [ '', ...components ].join(path.sep);
        }
    }
}
