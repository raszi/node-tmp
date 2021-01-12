
import {isBlank} from './StringUtils';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const isWin32 : boolean = os.platform() === 'win32';

export function osTmpDir(): string {
    return os.tmpdir();
}

export function normalizedOsTmpDir(): string {
    return normalize(this.osTmpDir());
}

export function resolvePath(name: string, root: string): string {
    return path.resolve(root, name);
}

export function isRelative(name: string, root: string): boolean {
    return name.startsWith(root);
}

export function containsPathSeparator(name: string): boolean {
    return name.indexOf('\\') !== -1 || name.indexOf('/') !== -1;
}

export function exists(name: string): boolean {
    return fs.existsSync(name);
}

// remove multiple occurrences of forward or backward slash, single/double quotes and handle excessive
// use of whitespace
// TODO:maybe split this into a sanitize and normalize, the former being used by Configuration and the latter during name generation, eliminating possible duplicate path.sep
export function normalize(name: string): string {
    if (isBlank(name)) {
        return '';
    }

    // Note: this does not support UNC paths such as \\server\path or //server/path
    const result = [];
    const components = name.replace(/[/]+/g, '/')
        .replace(/[\\]+/g, '/')
        .replace(/["]/g, '')
        .replace(/[']/g, '')
        .split('/');

    // make sure that we retain the leading path separator on Un*x derivates
    if (!isWin32 && name.startsWith('/')) {
        result.push('/');
    }

    // SECURITY eliminate all whitespace only components and trim whitespace around components
    for (const component of components) {
        const trimmed = component.trim();
        if (trimmed) {
            result.push(trimmed);
        }
    }

    // rejoin with the native path separator
    return join(...result);
}

export function join(...components : string[]) {
    return path.join(...components);
}