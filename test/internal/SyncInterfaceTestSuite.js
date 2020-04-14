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
const SyncInterfaceImpl_1 = require("../../src/internal/SyncInterfaceImpl");
const TestUtils_1 = require("../TestUtils");
const AbstractInterfaceTestSuiteBase_1 = require("./AbstractInterfaceTestSuiteBase");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let SyncInterfaceTestSuite = class SyncInterfaceTestSuite extends AbstractInterfaceTestSuiteBase_1.default {
    constructor() {
        super(...arguments);
        this.DIR = 'sync_iface_dir';
        this.FILE = 'sync_iface_file';
    }
    before() {
        this.sut = new SyncInterfaceImpl_1.default();
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    after() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    nameMustWorkAsExpected() {
        assert.equal(this.sut.name({ name: this.FILE }), TestUtils_1.default.qualifiedPath(this.FILE));
    }
    nameMustHandleErrorsAsExpected() {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        try {
            this.sut.name({ name: this.FILE });
        }
        catch (err) {
            assert.ok(err instanceof Error);
        }
    }
    fileMustWorkAsExpected() {
        const result = this.sut.file({ name: this.FILE });
        assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.FILE));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils_1.default.fileExists(result.name));
        result.dispose();
        assert.ok(!TestUtils_1.default.fileExists(TestUtils_1.default.qualifiedPath(this.FILE)));
    }
    fileMustHandleNameErrorsAsExpected() {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        try {
            this.sut.file({ name: this.FILE });
        }
        catch (err) {
            assert.ok(err instanceof Error);
        }
    }
    fileMustHandleObjectCreationErrorsAsExpected() {
        this.sut._creator = { createFile: (configuration) => {
                throw new Error();
            } };
        try {
            this.sut.file({ name: this.FILE });
        }
        catch (err) {
            assert.ok(err instanceof Error);
        }
    }
    dirMustWorkAsExpected() {
        const result = this.sut.dir({ name: this.DIR });
        assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.DIR));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils_1.default.dirExists(result.name));
        result.dispose();
        assert.ok(!TestUtils_1.default.dirExists(TestUtils_1.default.qualifiedPath(this.DIR)));
    }
    dirMustHandleNameErrorsAsExpected() {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        try {
            this.sut.dir({ name: this.DIR });
        }
        catch (err) {
            assert.ok(err instanceof Error);
        }
    }
    dirMustHandleObjectCreationErrorsAsExpected() {
        this.sut._creator = { createDir: (configuration) => {
                throw new Error();
            } };
        try {
            this.sut.dir({ name: this.DIR });
        }
        catch (err) {
            assert.ok(err instanceof Error);
        }
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "nameMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "nameMustHandleErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "fileMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "fileMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "fileMustHandleObjectCreationErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "dirMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "dirMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SyncInterfaceTestSuite.prototype, "dirMustHandleObjectCreationErrorsAsExpected", null);
SyncInterfaceTestSuite = __decorate([
    jest_1.suite
], SyncInterfaceTestSuite);
