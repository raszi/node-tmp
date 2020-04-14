"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = require("../src/internal/Configuration");
const PathUtils_1 = require("../src/internal/PathUtils");
const fs = require("fs");
const os = require("os");
const path = require("path");
const rimraf = require("rimraf");
class TestUtils {
    static fileExists(name) {
        try {
            const stat = fs.statSync(name);
            return stat.isFile();
        }
        catch (err) {
            return false;
        }
    }
    static dirExists(name) {
        try {
            const stat = fs.statSync(name);
            return stat.isDirectory();
        }
        catch (err) {
            return false;
        }
    }
    static createTempDir(name) {
        if (!fs.existsSync(name)) {
            fs.mkdirSync(this.qualifiedPath(name), Configuration_1.default.DEFAULT_DIR_MODE);
        }
    }
    static discardTempDir(name) {
        try {
            rimraf.sync(this.qualifiedPath(name));
        }
        catch (_) {
            // this might fail on cpm derivatives if the specified file does not exist
        }
    }
    static createTempFile(name) {
        if (!fs.existsSync(name)) {
            const fd = fs.openSync(this.qualifiedPath(name), Configuration_1.default.DEFAULT_FILE_FLAGS, Configuration_1.default.DEFAULT_FILE_MODE);
            fs.closeSync(fd);
        }
    }
    static discardTempFile(name) {
        try {
            rimraf.sync(this.qualifiedPath(name));
        }
        catch (_) {
            // this might fail on cpm derivatives if the specified file does not exist
        }
    }
    static qualifiedSubPath(name, root) {
        return path.join(root, name);
    }
    static qualifiedPath(name) {
        return PathUtils_1.default.resolvePath(name, new Configuration_1.default({}).tmpdir);
    }
    static dirOptions(options = {}) {
        return Object.assign(Object.assign({}, options), { mode: Configuration_1.default.DEFAULT_DIR_MODE });
    }
    static fileOptions(options = {}) {
        return Object.assign(Object.assign({}, options), { mode: Configuration_1.default.DEFAULT_FILE_MODE });
    }
    static dirConfiguration(options = {}) {
        return new Configuration_1.default(this.dirOptions(options));
    }
    static fileConfiguration(options = {}) {
        return new Configuration_1.default(this.fileOptions(options));
    }
    static nativePath(components) {
        return components.join(path.sep);
    }
    static nativeRootPath(components) {
        if (this.isCpmDerivative) {
            return ['C:', ...components].join(path.sep);
        }
        else {
            return ['', ...components].join(path.sep);
        }
    }
    static get isCpmDerivative() {
        return os.platform() === 'win32';
    }
}
exports.default = TestUtils;
