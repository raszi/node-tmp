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
const tmp = require("../src");
const PathUtils_1 = require("../src/internal/PathUtils");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let LegacyInterfaceSupportTestSuite = class LegacyInterfaceSupportTestSuite {
    constructor() {
        this.DIR = 'legacy_iface_dir';
        this.FILE = 'legacy_iface_file';
    }
    tmpdirMustExit() {
        assert.equal(tmp.tmpdir, PathUtils_1.default.normalizedOsTmpDir);
    }
    tmpNameMustExist() {
        assert.ok(typeof tmp.tmpName === 'function');
    }
    fileMustExist() {
        assert.ok(typeof tmp.file === 'function');
    }
    dirMustExist() {
        assert.ok(typeof tmp.dir === 'function');
    }
    tmpNameSyncMustExist() {
        assert.ok(typeof tmp.tmpNameSync === 'function');
    }
    fileSyncMustExist() {
        assert.ok(typeof tmp.fileSync === 'function');
    }
    dirSyncMustExist() {
        assert.ok(typeof tmp.dirSync === 'function');
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "tmpdirMustExit", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "tmpNameMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "fileMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "dirMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "tmpNameSyncMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "fileSyncMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LegacyInterfaceSupportTestSuite.prototype, "dirSyncMustExist", null);
LegacyInterfaceSupportTestSuite = __decorate([
    jest_1.suite
], LegacyInterfaceSupportTestSuite);
