
import {Options} from '../types';

import MathUtils from './MathUtils';
import PathUtils from './PathUtils';
import StringUtils from './StringUtils';

export default class Configuration {

    public static readonly DEFAULT_TRIES: number = 3;
    public static readonly MIN_TRIES: number = 1;
    public static readonly MAX_TRIES: number = 10;

    public static readonly TEMPLATE_PATTERN: string = 'XXXXXX';
    public static readonly TEMPLATE_REGEXP: RegExp = new RegExp(Configuration.TEMPLATE_PATTERN);

    public static readonly MIN_LENGTH: number = 6;
    public static readonly MAX_LENGTH: number = 24;
    public static readonly DEFAULT_LENGTH: number = 12;

    public static readonly DEFAULT_PREFIX = 'tmp';
    public static readonly DEFAULT_DIR_MODE: number = 0o700 /* 448 */;
    public static readonly DEFAULT_FILE_MODE: number = 0o600 /* 384 */;
    public static readonly DEFAULT_FILE_FLAGS: string = 'wx+';

    public static defaultOptions: Options = {
        prefix: Configuration.DEFAULT_PREFIX, length: Configuration.DEFAULT_LENGTH, tries: Configuration.DEFAULT_TRIES,
        fileMode: Configuration.DEFAULT_FILE_MODE, fileFlags: Configuration.DEFAULT_FILE_FLAGS,
        dirMode: Configuration.DEFAULT_DIR_MODE, forceClean: false, dir: '',
        // TODO 1.0.0 remove
        unsafeCleanup: false
    };

    public readonly tmpdir: string;
    public readonly name: string;
    public readonly prefix: string;
    public readonly postfix: string;
    public readonly dir: string;
    /**
     * @deprecated will be removed in 1.0.0
     */
    public readonly template: string;
    public readonly keep: boolean;
    public readonly forceClean: boolean;
    public readonly fileMode: number;
    public readonly fileFlags: string;
    public readonly dirMode: number;
    public readonly tries: number;
    public readonly length: number;

    public constructor(options : Options = {}) {
        const mergedOptions: Options = {...Configuration.defaultOptions, ...options};
        this.tmpdir = StringUtils.isBlank(mergedOptions.tmpdir) ? PathUtils.normalizedOsTmpDir : PathUtils.normalize(mergedOptions.tmpdir);
        this.name = PathUtils.normalize(mergedOptions.name);
        this.dir = PathUtils.normalize(mergedOptions.dir);
        this.prefix = PathUtils.normalize(mergedOptions.prefix);
        this.postfix = PathUtils.normalize(mergedOptions.postfix);
        this.keep = !!mergedOptions.keep;
        this.tries = MathUtils.clamp(mergedOptions.tries, Configuration.MIN_TRIES, Configuration.MAX_TRIES);
        this.fileMode = mergedOptions.fileMode;
        this.fileFlags = mergedOptions.fileFlags;
        this.dirMode = mergedOptions.dirMode;
        // TODO 1.0.0 remove support for template and unsafeCleanup
        this.template = PathUtils.normalize(mergedOptions.template);
        this.forceClean = !!mergedOptions.unsafeCleanup || !!mergedOptions.forceClean;
        const length = StringUtils.isBlank(this.template) ? mergedOptions.length : Configuration.MIN_LENGTH;
        this.length = MathUtils.clamp(length, Configuration.MIN_LENGTH, Configuration.MAX_LENGTH);

        this.validate();
    }

    /**
     * Validates the existing configuration.
     *
     * @throws Error
     */
    private validate(): void {
        if (!PathUtils.exists(this.tmpdir)) {
            throw new Error(`configured tmpdir '${this.tmpdir}' does not exist.`);
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
        if (!StringUtils.isBlank(this.template) && !this.template.match(Configuration.TEMPLATE_REGEXP)) {
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
