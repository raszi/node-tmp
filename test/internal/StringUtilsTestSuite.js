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
const StringUtils_1 = require("../../src/internal/StringUtils");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let StringUtilsTestSuite = class StringUtilsTestSuite {
    isBlank() {
        assert.ok(StringUtils_1.default.isBlank(null));
        assert.ok(StringUtils_1.default.isBlank(undefined));
        assert.ok(StringUtils_1.default.isBlank(''));
        assert.ok(StringUtils_1.default.isBlank(' '));
        assert.ok(!StringUtils_1.default.isBlank('a'));
    }
    sort() {
        assert.deepStrictEqual(StringUtils_1.default.sort(['a', 'b', 'a']), ['a', 'a', 'b']);
        assert.deepStrictEqual(StringUtils_1.default.sort(new Set(['b', 'a'])), ['a', 'b']);
    }
    rsort() {
        assert.deepStrictEqual(StringUtils_1.default.rsort(['a', 'b', 'a']), ['b', 'a', 'a']);
        assert.deepStrictEqual(StringUtils_1.default.rsort(new Set(['a', 'b'])), ['b', 'a']);
    }
    prefixesOnly() {
        const expected = ['a', 'b', 'c'];
        assert.deepStrictEqual(StringUtils_1.default.prefixesOnly(['a', 'ab', 'b', 'ba', 'c']), expected);
    }
    matchesPrefix() {
        assert.ok(StringUtils_1.default.matchesPrefix('ab', ['a']));
        assert.ok(!StringUtils_1.default.matchesPrefix('ab', ['b']));
    }
    determinePrefix() {
        assert.equal(StringUtils_1.default.determinePrefix('ab', ['a']), 'a');
        assert.equal(StringUtils_1.default.determinePrefix('ab', ['b']), 'ab');
    }
    nameFromComponents() {
        assert.equal(StringUtils_1.default.nameFromComponents('a', 'b'), `a-${process.pid}-b`);
        assert.equal(StringUtils_1.default.nameFromComponents('a', 'b', 'c'), `a-${process.pid}-b-c`);
    }
    nameFromTemplate() {
        assert.equal(StringUtils_1.default.nameFromTemplate(/XXX/, 'aXXXb', 'AAA'), `aAAAb`);
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "isBlank", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "sort", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "rsort", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "prefixesOnly", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "matchesPrefix", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "determinePrefix", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "nameFromComponents", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StringUtilsTestSuite.prototype, "nameFromTemplate", null);
StringUtilsTestSuite = __decorate([
    jest_1.suite
], StringUtilsTestSuite);
