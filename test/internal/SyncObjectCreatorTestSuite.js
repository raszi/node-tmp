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
const GarbageCollector_1 = require("../../src/internal/GarbageCollector");
const SyncObjectCreator_1 = require("../../src/internal/SyncObjectCreator");
const TestUtils_1 = require("../TestUtils");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let SyncObjectCreatorTestSuite = class SyncObjectCreatorTestSuite {
    constructor() {
        this.DIR = 'sync_object_dir';
        this.FILE = 'sync_object_file';
        this.sut = new SyncObjectCreator_1.default();
    }
    before() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    after() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    createFileMustReturnExpectedResult() {
        const configuration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
        const name = TestUtils_1.default.qualifiedPath(configuration.name);
        const result = this.sut.createFile(name, configuration);
        assert.equal(result.name, name);
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils_1.default.fileExists(result.name));
        assert.ok(typeof result.removeCallback === 'function');
        result.dispose();
        assert.ok(!TestUtils_1.default.fileExists(result.name));
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
    }
    createDirMustReturnExpectedResult() {
        const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const name = TestUtils_1.default.qualifiedPath(configuration.name);
        const result = this.sut.createDir(name, configuration);
        assert.equal(result.name, name);
        assert.ok(TestUtils_1.default.dirExists(result.name));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(typeof result.removeCallback === 'function');
        result.dispose();
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        assert.ok(!TestUtils_1.default.dirExists(result.name));
    }
    // TODO: createFileDisposeMustNotTryToUnlinkNonExistingObject
    // TODO: createDirDisposeMustNotTryToUnlinkNonExistingObject
    createDirDisposeMustForceCleanOnGlobalSetting() {
        const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const name = TestUtils_1.default.qualifiedPath(configuration.name);
        try {
            const result = this.sut.createDir(name, configuration);
            TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
            GarbageCollector_1.default.INSTANCE.forceClean = true;
            result.dispose();
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        }
        finally {
            GarbageCollector_1.default.INSTANCE.forceClean = false;
        }
    }
    createDirDisposeMustForceCleanOnConfigurationSetting() {
        const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR, forceClean: true });
        const name = TestUtils_1.default.qualifiedPath(configuration.name);
        const result = this.sut.createDir(name, configuration);
        TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
        result.dispose();
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
    }
    createDirDisposeMustFailOnNonEmptyDir() {
        const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
        const name = TestUtils_1.default.qualifiedPath(configuration.name);
        try {
            const result = this.sut.createDir(name, configuration);
            TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
            result.dispose();
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        }
        catch (err) {
            assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
        }
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncObjectCreatorTestSuite.prototype, "createFileMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncObjectCreatorTestSuite.prototype, "createDirMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnGlobalSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnConfigurationSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncObjectCreatorTestSuite.prototype, "createDirDisposeMustFailOnNonEmptyDir", null);
SyncObjectCreatorTestSuite = __decorate([
    jest_1.suite
], SyncObjectCreatorTestSuite);
