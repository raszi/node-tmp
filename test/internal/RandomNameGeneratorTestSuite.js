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
const RandomNameGenerator_1 = require("../../src/internal/RandomNameGenerator");
const crypto = require("crypto");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let RandomNameGeneratorTestSuite = class RandomNameGeneratorTestSuite {
    constructor() {
        this.sut = new RandomNameGenerator_1.default();
    }
    mustFallbackOnPseudoRandom() {
        const origRandomBytesfn = crypto.randomBytes;
        const origPseudoRandomBytesfn = crypto.pseudoRandomBytes;
        let called = false;
        crypto.randomBytes = (length) => { throw new Error(); };
        crypto.pseudoRandomBytes = (length) => { called = true; return origPseudoRandomBytesfn(length); };
        try {
            this.sut.generate(1);
            assert.ok(called);
        }
        finally {
            crypto.randomBytes = origRandomBytesfn;
            crypto.pseudoRandomBytes = origPseudoRandomBytesfn;
        }
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RandomNameGeneratorTestSuite.prototype, "mustFallbackOnPseudoRandom", null);
RandomNameGeneratorTestSuite = __decorate([
    jest_1.suite
], RandomNameGeneratorTestSuite);
