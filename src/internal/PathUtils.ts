
import StringUtils from './StringUtils';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export default class PathUtils {

    public static get isWin32() : boolean {
        return os.platform() === 'win32';
    }

    public static isRelative(name: string, root: string): boolean {
        return name.startsWith(root);
    }

    public static containsPathSeparator(name: string): boolean {
        return name.indexOf('\\') !== -1 || name.indexOf('/') !== -1;
    }

    public static exists(name: string): boolean {
        return fs.existsSync(name);
    }

    // remove multiple occurrences of forward or backward slash, single/double quotes and handle excessive
    // use of whitespace

    // TODO:maybe split this into a sanitize and normalize, the former being used by Configuration and the latter during name generation, eliminating possible duplicate path.sep
    public static normalize(name: string): string {
        if (StringUtils.isBlank(name)) {
            return '';
        }

        // TODO do we require support for UNC paths such as \\server\path or //server/path?
        // replace all occurrences of '/' and '\' by a single '/'
        const result = [];
        const components = name.replace(/[/]+/g, '/')
            .replace(/[\\]+/g, '/')
            .replace(/["]/g, '')
            .replace(/[']/g, '')
            .split('/');

        // make sure that we retain the leading path separator on Un*x derivates
        if (!this.isWin32 && name.startsWith('/')) {
            result.push('');
        }

        // SECURITY eliminate all whitespace only components and trim whitespace around components
        for (const component of components) {
            const trimmed = component.trim();
            if (trimmed) {
                result.push(trimmed);
            }
        }

        // rejoin with the native path separator
        return this.join(...result);
    }

    public static join(...components : string[]) {
        return path.join(...components);
    }

    public static get osTmpDir(): string {
        return os.tmpdir();
    }

    public static get normalizedOsTmpDir(): string {
        return this.normalize(this.osTmpDir);
    }

    public static resolvePath(name: string, root: string): string {
        return path.resolve(root, name);
    }
}
