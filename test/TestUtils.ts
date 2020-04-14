import {Options} from '../src/';

import Configuration from '../src/internal/Configuration';
import PathUtils from '../src/internal/PathUtils';

import * as fs from 'fs';
import * as os from 'os';
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
        if (!fs.existsSync(name)) {
            fs.mkdirSync(this.qualifiedPath(name), Configuration.DEFAULT_DIR_MODE);
        }
    }

    public static discardTempDir(name: string): void {
        try {
            rimraf.sync(this.qualifiedPath(name));
        } catch (_) {
            // this might fail on cpm derivatives if the specified file does not exist
        }
    }

    public static createTempFile(name: string) {
        if (!fs.existsSync(name)) {
            const fd: number = fs.openSync(this.qualifiedPath(name), Configuration.DEFAULT_FILE_FLAGS, Configuration.DEFAULT_FILE_MODE);
            fs.closeSync(fd);
        }
    }

    public static discardTempFile(name: string): void {
        try {
            rimraf.sync(this.qualifiedPath(name));
        } catch (_) {
            // this might fail on cpm derivatives if the specified file does not exist
        }
    }

    public static qualifiedSubPath(name: string, root: string): string {
        return path.join(root, name);
    }

    public static qualifiedPath(name: string): string {
        return PathUtils.resolvePath(name, new Configuration({}).tmpdir);
    }

    public static dirOptions(options: Options = {}): Options {
        return {
            ...options,
            mode: Configuration.DEFAULT_DIR_MODE
        };
    }

    public static fileOptions(options: Options = {}): Options {
        return {
            ...options,
            mode: Configuration.DEFAULT_FILE_MODE
        };
    }

    public static dirConfiguration(options: Options = {}): Configuration {
        return new Configuration(this.dirOptions(options));
    }

    public static fileConfiguration(options: Options = {}): Configuration {
        return new Configuration(this.fileOptions(options));
    }

    public static nativePath(components: string[]): string {
        return components.join(path.sep);
    }

    public static nativeRootPath(components: string[]): string {
        if (this.isCpmDerivative) {
            return [ 'C:', ...components ].join(path.sep);
        } else {
            return [ '', ...components ].join(path.sep);
        }
    }

    public static get isCpmDerivative(): boolean {
        return os.platform() === 'win32';
    }
}
