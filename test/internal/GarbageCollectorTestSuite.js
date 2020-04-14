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
let GarbageCollectorTestSuite = class GarbageCollectorTestSuite {
    INSTANCE() {
        assert.ok(GarbageCollector_1.default.INSTANCE instanceof GarbageCollector_1.default);
    }
    registerDir() {
        GarbageCollector_1.default.INSTANCE.registerDir('dir', new Configuration_1.default());
        assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir'));
        GarbageCollector_1.default.INSTANCE.unregisterObject('dir');
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir'));
    }
    registerFile() {
        GarbageCollector_1.default.INSTANCE.registerDir('dir', new Configuration_1.default());
        GarbageCollector_1.default.INSTANCE.registerFile('file', new Configuration_1.default());
        GarbageCollector_1.default.INSTANCE.registerFile('dir/file', new Configuration_1.default());
        GarbageCollector_1.default.INSTANCE.registerFile('dir/file2', new Configuration_1.default());
        assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir'));
        assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject('file'));
        assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir/file'));
        assert.ok(GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir/file2'));
        GarbageCollector_1.default.INSTANCE.unregisterObject('dir/file2');
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir/file2'));
        GarbageCollector_1.default.INSTANCE.unregisterObject('dir');
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject('dir/file'));
        GarbageCollector_1.default.INSTANCE.unregisterObject('file');
        assert.ok(!GarbageCollector_1.default.INSTANCE.isRegisteredObject('file'));
    }
    dispose() {
        // TODO: use chai instead
        const watches = {
            reset: false,
            prune: false,
            dirGarbageSet: false,
            fileGarbageSet: false,
            prunedDirGarbageGet: false,
            prunedFileGarbageGet: false
        };
        const origPruner = GarbageCollector_1.default.INSTANCE._pruner;
        GarbageCollector_1.default.INSTANCE._pruner = {
            set dirGarbage(value) { watches.dirGarbageSet = true; },
            set fileGarbage(value) { watches.fileGarbageSet = true; },
            get prunedDirGarbage() { watches.prunedDirGarbageGet = true; return []; },
            get prunedFileGarbage() { watches.prunedFileGarbageGet = true; return []; },
            prune() { watches.prune = true; },
            reset() { watches.reset = true; }
        };
        const origDisposer = GarbageCollector_1.default.INSTANCE._disposer;
        GarbageCollector_1.default.INSTANCE._disposer = {
            disposeDirGarbage(dirGarbage) { },
            disposeFileGarbage(fileGarbage) { },
        };
        try {
            GarbageCollector_1.default.INSTANCE.dispose();
            assert.ok(watches.reset);
            assert.ok(watches.prune);
            assert.ok(watches.dirGarbageSet);
            assert.ok(watches.fileGarbageSet);
            assert.ok(watches.prunedDirGarbageGet);
            assert.ok(watches.prunedFileGarbageGet);
        }
        finally {
            GarbageCollector_1.default.INSTANCE._pruner = origPruner;
            GarbageCollector_1.default.INSTANCE._disposer = origDisposer;
        }
    }
    forceClean() {
        GarbageCollector_1.default.INSTANCE.forceClean = true;
        assert.ok(GarbageCollector_1.default.INSTANCE.forceClean);
        GarbageCollector_1.default.INSTANCE.forceClean = false;
        assert.ok(!GarbageCollector_1.default.INSTANCE.forceClean);
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarbageCollectorTestSuite.prototype, "INSTANCE", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarbageCollectorTestSuite.prototype, "registerDir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarbageCollectorTestSuite.prototype, "registerFile", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarbageCollectorTestSuite.prototype, "dispose", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GarbageCollectorTestSuite.prototype, "forceClean", null);
GarbageCollectorTestSuite = __decorate([
    jest_1.suite
], GarbageCollectorTestSuite);
