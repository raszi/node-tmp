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
const AsyncInterfaceImpl_1 = require("../../src/internal/AsyncInterfaceImpl");
const TestUtils_1 = require("../TestUtils");
const AbstractInterfaceTestSuiteBase_1 = require("./AbstractInterfaceTestSuiteBase");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let AsyncInterfaceTestSuite = class AsyncInterfaceTestSuite extends AbstractInterfaceTestSuiteBase_1.default {
    constructor() {
        super(...arguments);
        this.DIR = 'async_iface_dir';
        this.FILE = 'async_iface_file';
    }
    before() {
        this.sut = new AsyncInterfaceImpl_1.default();
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    after() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    nameMustWorkAsExpected(done) {
        this.sut.name((err, name) => {
            if (err) {
                return done(err);
            }
            try {
                assert.equal(name, TestUtils_1.default.qualifiedPath(this.FILE));
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.FILE });
    }
    nameMustHandleErrorsAsExpected(done) {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        this.sut.name((err, name) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.FILE });
    }
    fileMustWorkAsExpected(done) {
        this.sut.file((err, result) => {
            if (err) {
                return done(err);
            }
            try {
                assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.FILE));
                assert.ok(TestUtils_1.default.fileExists(result.name));
                // TODO: assert is file
                assert.ok(typeof result.dispose === 'function');
                result.dispose();
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.FILE });
    }
    fileMustHandleNameErrorsAsExpected(done) {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        this.sut.file((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.FILE });
    }
    fileMustHandleObjectCreationErrorsAsExpected(done) {
        this.sut._creator = { createFile: (name, configuration, cb) => {
                return cb(new Error());
            } };
        this.sut.file((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.FILE });
    }
    dirMustWorkAsExpected(done) {
        this.sut.dir((err, result) => {
            if (err) {
                return done(err);
            }
            try {
                assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.DIR));
                assert.ok(TestUtils_1.default.dirExists(result.name));
                // TODO: assert is dir
                assert.ok(typeof result.dispose === 'function');
                result.dispose();
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.DIR });
    }
    dirMustHandleNameErrorsAsExpected(done) {
        this.sut._nameGenerator = { generate: (configuration) => {
                throw new Error();
            } };
        this.sut.dir((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.DIR });
    }
    dirMustHandleObjectCreationErrorsAsExpected(done) {
        this.sut._creator = { createDir: (name, configuration, cb) => {
                return cb(new Error());
            } };
        this.sut.dir((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            }
            catch (err) {
                return done(err);
            }
        }, { name: this.DIR });
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "nameMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "nameMustHandleErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "fileMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "fileMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "fileMustHandleObjectCreationErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "dirMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "dirMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AsyncInterfaceTestSuite.prototype, "dirMustHandleObjectCreationErrorsAsExpected", null);
AsyncInterfaceTestSuite = __decorate([
    jest_1.suite
], AsyncInterfaceTestSuite);
