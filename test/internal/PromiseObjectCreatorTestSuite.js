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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GarbageCollector_1 = require("../../src/internal/GarbageCollector");
const PromiseObjectCreator_1 = require("../../src/internal/PromiseObjectCreator");
const TestUtils_1 = require("../TestUtils");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let PromiseObjectCreatorTestSuite = class PromiseObjectCreatorTestSuite {
    constructor() {
        this.DIR = 'async_object_dir';
        this.FILE = 'async_object_file';
        this.sut = new PromiseObjectCreator_1.default();
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
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            const promise = this.sut.createFile(name, configuration);
            const result = yield promise;
            assert.equal(result.name, name);
            assert.ok(TestUtils_1.default.fileExists(result.name));
            assert.ok(typeof result.dispose === 'function');
            const disposePromise = result.dispose();
            yield disposePromise;
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        });
    }
    createFileDisposeMustNotTryToUnlinkNonExistingObject() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.fileConfiguration({ name: this.FILE });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            const result = yield this.sut.createFile(name, configuration);
            TestUtils_1.default.discardTempFile(name);
            assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
            yield result.dispose();
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        });
    }
    createDirMustReturnExpectedResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            const promise = this.sut.createDir(name, configuration);
            const result = yield promise;
            assert.equal(result.name, name);
            assert.ok(TestUtils_1.default.dirExists(result.name));
            assert.ok(typeof result.dispose === 'function');
            const disposePromise = result.dispose();
            yield disposePromise;
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        });
    }
    createDirDisposeMustNotTryToUnlinkNonExistingObject() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            const result = yield this.sut.createDir(name, configuration);
            TestUtils_1.default.discardTempDir(name);
            assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
            yield result.dispose();
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        });
    }
    createDirDisposeMustForceCleanOnGlobalSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            try {
                const result = yield this.sut.createDir(name, configuration);
                TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
                GarbageCollector_1.default.INSTANCE.forceClean = true;
                yield result.dispose();
                assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
            }
            finally {
                GarbageCollector_1.default.INSTANCE.forceClean = false;
            }
        });
    }
    createDirDisposeMustForceCleanOnConfigurationSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR, forceClean: true });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            const result = yield this.sut.createDir(name, configuration);
            TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
            yield result.dispose();
            assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
        });
    }
    createDirDisposeMustFailOnNonEmptyDir() {
        return __awaiter(this, void 0, void 0, function* () {
            const configuration = TestUtils_1.default.dirConfiguration({ name: this.DIR });
            const name = TestUtils_1.default.qualifiedPath(configuration.name);
            // TODO:refactor
            try {
                const result = yield this.sut.createDir(name, configuration);
                TestUtils_1.default.createTempFile(TestUtils_1.default.qualifiedSubPath(this.FILE, result.name));
                yield result.dispose();
                assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject(name));
            }
            catch (err) {
                assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
            }
        });
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createFileMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createFileDisposeMustNotTryToUnlinkNonExistingObject", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createDirMustReturnExpectedResult", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createDirDisposeMustNotTryToUnlinkNonExistingObject", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnGlobalSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createDirDisposeMustForceCleanOnConfigurationSetting", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseObjectCreatorTestSuite.prototype, "createDirDisposeMustFailOnNonEmptyDir", null);
PromiseObjectCreatorTestSuite = __decorate([
    jest_1.suite
], PromiseObjectCreatorTestSuite);
