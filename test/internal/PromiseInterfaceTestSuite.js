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
const PromiseInterfaceImpl_1 = require("../../src/internal/PromiseInterfaceImpl");
const TestUtils_1 = require("../TestUtils");
const AbstractInterfaceTestSuiteBase_1 = require("./AbstractInterfaceTestSuiteBase");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let PromiseInterfaceTestSuite = class PromiseInterfaceTestSuite extends AbstractInterfaceTestSuiteBase_1.default {
    constructor() {
        super(...arguments);
        this.DIR = 'promise_iface_dir';
        this.FILE = 'promise_iface_file';
    }
    before() {
        this.sut = new PromiseInterfaceImpl_1.default();
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    after() {
        TestUtils_1.default.discardTempFile(this.FILE);
        TestUtils_1.default.discardTempDir(this.DIR);
    }
    nameMustWorkAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sut.name({ name: this.FILE })
                .then((name) => {
                assert.equal(name, TestUtils_1.default.qualifiedPath(this.FILE));
            });
        });
    }
    nameMustHandleErrorsAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sut._nameGenerator = { generate: (configuration) => {
                    throw new Error();
                } };
            let caught = false;
            return this.sut.name({ name: this.FILE })
                .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
                .finally(() => {
                assert.ok(caught);
            });
        });
    }
    fileMustWorkAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sut.file(TestUtils_1.default.fileOptions({ name: this.FILE }))
                .then((result) => {
                assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.FILE));
                assert.ok(typeof result.dispose === 'function');
                assert.ok(TestUtils_1.default.fileExists(result.name));
                return result.dispose();
            })
                .then(() => {
                assert.ok(!TestUtils_1.default.fileExists(TestUtils_1.default.qualifiedPath(this.FILE)));
            });
        });
    }
    fileMustHandleNameErrorsAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sut._nameGenerator = { generate: (configuration) => {
                    throw new Error();
                } };
            let caught = false;
            return this.sut.file({ name: this.FILE })
                .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
                .finally(() => {
                assert.ok(caught);
            });
        });
    }
    fileMustHandleObjectCreationErrorsAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sut._creator = { createFile: (configuration) => {
                    return Promise.reject(new Error());
                } };
            let caught = false;
            return this.sut.file({ name: this.FILE })
                .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
                .finally(() => {
                assert.ok(caught);
            });
        });
    }
    dirMustWorkAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sut.dir(TestUtils_1.default.dirOptions({ name: this.DIR }))
                .then((result) => {
                assert.equal(result.name, TestUtils_1.default.qualifiedPath(this.DIR));
                assert.ok(typeof result.dispose === 'function');
                assert.ok(TestUtils_1.default.dirExists(result.name));
                return result.dispose();
            })
                .then(() => {
                assert.ok(!TestUtils_1.default.dirExists(TestUtils_1.default.qualifiedPath(this.DIR)));
            });
        });
    }
    dirMustHandleNameErrorsAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sut._nameGenerator = { generate: (configuration) => {
                    throw new Error();
                } };
            let caught = false;
            return this.sut.dir({ name: this.DIR })
                .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
                .finally(() => {
                assert.ok(caught);
            });
        });
    }
    dirMustHandleObjectCreationErrorsAsExpected() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sut._creator = { createDir: (configuration) => {
                    return Promise.reject(new Error());
                } };
            let caught = false;
            return this.sut.dir({ name: this.DIR })
                .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
                .finally(() => {
                assert.ok(caught);
            });
        });
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "nameMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "nameMustHandleErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "fileMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "fileMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "fileMustHandleObjectCreationErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "dirMustWorkAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "dirMustHandleNameErrorsAsExpected", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromiseInterfaceTestSuite.prototype, "dirMustHandleObjectCreationErrorsAsExpected", null);
PromiseInterfaceTestSuite = __decorate([
    jest_1.suite
], PromiseInterfaceTestSuite);
