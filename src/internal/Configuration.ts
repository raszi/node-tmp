
import {Options} from '..';

import PathUtils from './PathUtils';
import StringUtils from './StringUtils';

export default class Configuration {

    public static readonly DEFAULT_TRIES: number = 3;
    public static readonly MIN_TRIES: number = 1;
    public static readonly MAX_TRIES: number = 10;

    public static readonly TEMPLATE_PATTERN: RegExp = /XXXXXX/;

    public static readonly MIN_LENGTH: number = 6;
    public static readonly MAX_LENGTH: number = 24;
    public static readonly DEFAULT_LENGTH: number = 12;

    public static readonly DEFAULT_PREFIX = 'tmp';
    public static readonly DEFAULT_DIR_MODE: number = 0o700 /* 448 */;
    public static readonly DEFAULT_FILE_MODE: number = 0o600 /* 384 */;
    public static readonly DEFAULT_FILE_FLAGS: string = 'wx+';

    public readonly tmpdir: string;
    public readonly name: string;
    public readonly prefix: string;
    public readonly postfix: string;
    public readonly dir: string;
    public readonly template: string;
    public readonly keep: boolean;
    public readonly forceClean: boolean;
    public readonly mode: number;
    public readonly tries: number;
    public readonly length: number;

    private readonly _resolvedDir: string;

    public readonly fileFlags: string = Configuration.DEFAULT_FILE_FLAGS;

    public constructor(options: Options = {}, defaultMode: number = 0o000) {
        this.tmpdir = PathUtils.normalizedOsTmpDir;
        this.name = PathUtils.normalize(options.name);
        const dir = PathUtils.normalize(options.dir);
        if (!StringUtils.isBlank(dir)) {
            this._resolvedDir = PathUtils.resolvePath(dir, this.tmpdir);
            this.dir = PathUtils.makeRelative(this._resolvedDir, this.tmpdir);
        } else {
            this.dir = '';
        }
        this.template = PathUtils.normalize(options.template);
        this.prefix = PathUtils.normalize(options.prefix) || Configuration.DEFAULT_PREFIX;
        this.postfix = PathUtils.normalize(options.postfix);
        this.keep = !!options.keep;
        // clamp to MIN_TRIES..MAX_TRIES
        this.tries = Math.min(Math.max(Math.abs(options.tries) || Configuration.DEFAULT_TRIES, Configuration.MIN_TRIES), Configuration.MAX_TRIES);
        // TODO:1.0.0 remove support for unsafeCleanup
        this.forceClean = !!options.unsafeCleanup || !!options.forceClean;
        this.mode = options.mode || defaultMode;
        // TODO why clamp length?
        const length = StringUtils.isBlank(this.template) ? Math.abs(options.length) || Configuration.DEFAULT_LENGTH : Configuration.MIN_LENGTH;
        this.length = Math.min(Math.max(length, Configuration.MIN_LENGTH), Configuration.MAX_LENGTH);

        this.validate();
    }

    /**
     * Validates the existing configuration.
     *
     * @throws Error
     */
    private validate(): void {
        if (!PathUtils.exists(this.tmpdir)) {
            throw new Error(`configured system tmp dir '${this.tmpdir}' does not exist.`);
        }
        const dirIsNotBlank = !StringUtils.isBlank(this.dir);
        if (dirIsNotBlank && !PathUtils.exists(PathUtils.resolvePath(this.dir, this.tmpdir))) {
            throw new Error(`configured dir '${this.dir}' does not exist.`);
        }
        if (dirIsNotBlank && !PathUtils.isRelative(this.dir, this.tmpdir)) {
            throw new Error(`configured dir '${this.dir}' must be relative to '${this.tmpdir}'.`);
        }
        // TODO template is obsolete
        // TODO: assert is dir is actually a directory
        if (PathUtils.containsPathSeparator(this.template)) {
            throw new Error(`Invalid template, must not contain path separator, got '${this.template}'.`);
        }
        if (!StringUtils.isBlank(this.template) && !this.template.match(Configuration.TEMPLATE_PATTERN)) {
            throw new Error(`Invalid template, got '${this.template}'.`);
        }
        if (PathUtils.containsPathSeparator(this.name)) {
            throw new Error(`Invalid name, must not contain path separator, got '${this.name}'.`);
        }
        if (PathUtils.containsPathSeparator(this.prefix)) {
            throw new Error(`Invalid prefix, must not contain path separator, got '${this.prefix}'.`);
        }
        if (PathUtils.containsPathSeparator(this.postfix)) {
            throw new Error(`Invalid postfix, must not contain path separator, got '${this.postfix}'.`);
        }
    }
}
