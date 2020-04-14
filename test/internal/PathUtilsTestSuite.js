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
const PathUtils_1 = require("../../src/internal/PathUtils");
const TestUtils_1 = require("../TestUtils");
const os = require("os");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let PathUtilsTestSuite = class PathUtilsTestSuite {
    isRelative() {
        assert.ok(PathUtils_1.default.isRelative('/tmp/foo', '/tmp'));
        assert.ok(!PathUtils_1.default.isRelative('/tmp/foo', '/tmp/bar'));
    }
    containsPathSeparator() {
        if (TestUtils_1.default.isCpmDerivative) {
            assert.ok(PathUtils_1.default.containsPathSeparator('C:\\tmp\foo'));
            assert.ok(!PathUtils_1.default.containsPathSeparator('foo'));
        }
        else {
            assert.ok(PathUtils_1.default.containsPathSeparator('/tmp/foo'));
            assert.ok(!PathUtils_1.default.containsPathSeparator('foo'));
        }
    }
    exists() {
        assert.ok(PathUtils_1.default.exists(PathUtils_1.default.osTmpDir));
        assert.ok(!PathUtils_1.default.exists(TestUtils_1.default.nativeRootPath(['tmp-NON_EXISTING'])));
    }
    normalize() {
        assert.equal(PathUtils_1.default.normalize(undefined), '');
        assert.equal(PathUtils_1.default.normalize(null), '');
        assert.equal(PathUtils_1.default.normalize(''), '');
        assert.equal(PathUtils_1.default.normalize(' '), '');
        assert.equal(PathUtils_1.default.normalize('\'foo\''), 'foo');
        assert.equal(PathUtils_1.default.normalize('\"foo\"'), 'foo');
        assert.equal(PathUtils_1.default.normalize('\\\\foo\\\\bar'), '\\foo\\bar');
        assert.equal(PathUtils_1.default.normalize('//foo//bar'), '/foo/bar');
    }
    osTmpDir() {
        assert.equal(PathUtils_1.default.osTmpDir, os.tmpdir());
    }
    resolvePath() {
        const root = TestUtils_1.default.nativeRootPath(['tmp']);
        const absolute = TestUtils_1.default.nativeRootPath(['tmp', 'foo']);
        const relative = TestUtils_1.default.nativeRootPath(['tmp', 'rel']);
        assert.equal(PathUtils_1.default.resolvePath(absolute, root), absolute);
        assert.equal(PathUtils_1.default.resolvePath('rel', root), relative);
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "isRelative", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "containsPathSeparator", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "exists", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "normalize", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "osTmpDir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PathUtilsTestSuite.prototype, "resolvePath", null);
PathUtilsTestSuite = __decorate([
    jest_1.suite
], PathUtilsTestSuite);
