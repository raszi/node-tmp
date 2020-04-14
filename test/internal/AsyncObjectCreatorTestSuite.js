"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncObjectCreator_1 = require("../../src/internal/AsyncObjectCreator");
const GarbageCollector_1 = require("../../src/internal/GarbageCollector");
const TestUtils_1 = require("../TestUtils");
const fs = require("fs");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let AsyncObjectCreatorTestSuite = class AsyncObjectCreatorTestSuite {
    constructor() {
        this.DIR = 'async_object_dir';
        this.FILE = 'async_object_file';
        this.sut = new AsyncObjectCreator_1.default();
    }
    before() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    after() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    createFileMustReturnExpectedResult(done) {
        const oconfiguration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            try {
                assert.equal(result.name, oname);
                assert.ok(TestUtils_1.default.fileExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils_1.default.fileExists(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
    createFileMustHandleErrorOnOpen(done) {
        const fsopenfn = fs.open;
        fs.open = function (name, flags, mode, cb) { return cb(new Error()); };
        const oconfiguration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
            finally {
                fs.open = fsopenfn;
            }
        });
    }
    createFileMustHandleErrorOnClose(done) {
        const fsclosefn = fs.close;
        fs.close = function (fd, cb) {
            return fsclosefn(fd, function () { cb(new Error()); });
        };
        const oconfiguration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
            finally {
                fs.close = fsclosefn;
            }
        });
    }
    createFileDisposeMustNotTryToUnlinkNonExistingObject(done) {
        const oconfiguration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            try {
                TestUtils_1.default.discardTempFile(result.name);
                return result.dispose((err) => {
                    assert.ok(!err);
                    assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                    return done();
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
    createDirMustReturnExpectedResult(done) {
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                assert.equal(result.name, oname);
                assert.ok(TestUtils_1.default.dirExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils_1.default.dirExists(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
    createDirMustHandleErrorOnMkdir(done) {
        const fsmkdirfn = fs.mkdir;
        fs.mkdir = function (name, mode, cb) { return cb(new Error()); };
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
            finally {
                fs.mkdir = fsmkdirfn;
            }
        });
    }
    createDirDisposeMustForceCleanOnGlobalSetting(done) {
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils_1.default.qualifiedSubPath('file', result.name);
                TestUtils_1.default.createTempFile(fname);
                GarbageCollector_1.default.INSTANCE.forceClean = true;
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils_1.default.fileExists(fname));
                        assert.ok(!TestUtils_1.default.dirExists(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                    finally {
                        GarbageCollector_1.default.INSTANCE.forceClean = false;
                    }
                });
            }
            catch (err) {
                return done(err);
            }
            finally {
                GarbageCollector_1.default.INSTANCE.forceClean = false;
            }
        });
    }
    createDirDisposeMustForceCleanOnConfigurationSetting(done) {
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR, forceClean: true });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils_1.default.qualifiedSubPath('file', result.name);
                TestUtils_1.default.createTempFile(fname);
                return result.dispose((err) => {
                    try {
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils_1.default.fileExists(fname));
                        assert.ok(!TestUtils_1.default.dirExists(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
    createDirDisposeMustNotTryToUnlinkNonExistingObject(done) {
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                TestUtils_1.default.discardTempDir(result.name);
                return result.dispose((err) => {
                    try {
                        assert.ok(!err);
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
    createDirDisposeMustFailOnNonEmptyDir(done) {
        const oconfiguration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const oname = TestUtils_1.default.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils_1.default.qualifiedSubPath(this.FILE, result.name);
                TestUtils_1.default.createTempFile(fname);
                return result.dispose((err) => {
                    try {
                        assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
                        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils_1.default.fileExists(fname));
                        assert.ok(TestUtils_1.default.dirExists(result.name));
                        return done();
                    }
                    catch (err) {
                        return done(err);
                    }
                });
            }
            catch (err) {
                return done(err);
            }
        });
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createFileMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createFileMustHandleErrorOnOpen", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createFileMustHandleErrorOnClose", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createFileDisposeMustNotTryToUnlinkNonExistingObject", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirMustHandleErrorOnMkdir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnGlobalSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnConfigurationSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirDisposeMustNotTryToUnlinkNonExistingObject", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncObjectCreatorTestSuite.prototype, "createDirDisposeMustFailOnNonEmptyDir", null);
AsyncObjectCreatorTestSuite = __decorate([
    jest_1.suite
], AsyncObjectCreatorTestSuite);
