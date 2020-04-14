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
const Configuration_1 = require("../../src/internal/Configuration");
const GarbageCollector_1 = require("../../src/internal/GarbageCollector");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
class AbstractInterfaceTestSuiteBase {
    tmpdir() {
        assert.equal(this.sut.tmpdir, new Configuration_1.default().tmpdir);
    }
    forceClean() {
        this.sut.forceClean();
        try {
            assert.ok(GarbageCollector_1.default.INSTANCE.forceClean);
        }
        finally {
            GarbageCollector_1.default.INSTANCE.forceClean = false;
        }
    }
}
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractInterfaceTestSuiteBase.prototype, "tmpdir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AbstractInterfaceTestSuiteBase.prototype, "forceClean", null);
exports.default = AbstractInterfaceTestSuiteBase;
