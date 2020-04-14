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
const AsyncInterfaceImpl_1 = require("../src/internal/AsyncInterfaceImpl");
const PromiseInterfaceImpl_1 = require("../src/internal/PromiseInterfaceImpl");
const SyncInterfaceImpl_1 = require("../src/internal/SyncInterfaceImpl");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let TmpInterfaceTestSuite = class TmpInterfaceTestSuite {
    asyncMustExist() {
        assert.ok(tmp.async instanceof AsyncInterfaceImpl_1.default);
    }
    syncMustExist() {
        assert.ok(tmp.sync instanceof SyncInterfaceImpl_1.default);
    }
    promiseMustExist() {
        assert.ok(tmp.promise instanceof PromiseInterfaceImpl_1.default);
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TmpInterfaceTestSuite.prototype, "asyncMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TmpInterfaceTestSuite.prototype, "syncMustExist", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TmpInterfaceTestSuite.prototype, "promiseMustExist", null);
TmpInterfaceTestSuite = __decorate([
    jest_1.suite
], TmpInterfaceTestSuite);
