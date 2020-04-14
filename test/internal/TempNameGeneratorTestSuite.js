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
const StringUtils_1 = require("../../src/internal/StringUtils");
const TempNameGenerator_1 = require("../../src/internal/TempNameGenerator");
const TestUtils_1 = require("../TestUtils");
const path = require("path");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let TempNameGeneratorTestSuite = class TempNameGeneratorTestSuite {
    constructor() {
        this.sut = new TempNameGenerator_1.default();
    }
    generateMustNotFailOnEmptyConfiguration() {
        const configuration = new Configuration_1.default({});
        this.sut.generate(configuration);
    }
    generateMustNotFailOnNonExistingUserProvidedName() {
        const configuration = new Configuration_1.default({
            name: 'nonexistent'
        });
        const name = this.sut.generate(configuration);
        assert.equal(name, path.join(configuration.tmpdir, configuration.name));
    }
    generateMustFailOnExistingUserProvidedName() {
        const configuration = new Configuration_1.default({
            name: 'existingname'
        });
        TestUtils_1.default.createTempFile(configuration.name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        }
        finally {
            TestUtils_1.default.discardTempFile(configuration.name);
        }
    }
    generateMustGenerateExpectedNameFromTemplate() {
        const configuration = new Configuration_1.default({
            template: 'templateXXXXXX'
        });
        const name = this.sut.generate(configuration);
        assert.ok(name.match(/template.{6}$/));
    }
    generateMustFailOnExistingNameUsingTemplate() {
        const configuration = new Configuration_1.default({
            template: 'templateXXXXXX'
        });
        this.sut._nameGenerator = {
            generate: (length) => {
                return 'duplicate';
            }
        };
        const name = StringUtils_1.default.nameFromTemplate(Configuration_1.default.TEMPLATE_PATTERN, configuration.template, 'duplicate');
        TestUtils_1.default.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        }
        finally {
            TestUtils_1.default.discardTempFile(name);
        }
    }
    generateMustFailOnExistingName() {
        const configuration = new Configuration_1.default({});
        this.sut._nameGenerator = {
            generate: (length) => {
                return 'duplicate';
            }
        };
        const name = StringUtils_1.default.nameFromComponents(configuration.prefix, 'duplicate');
        TestUtils_1.default.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        }
        finally {
            TestUtils_1.default.discardTempFile(name);
        }
    }
    generateMustFailOnExistingNameWithPostfix() {
        const configuration = new Configuration_1.default({
            postfix: 'postfix'
        });
        this.sut._nameGenerator = {
            generate: (length) => {
                return 'duplicate';
            }
        };
        const name = StringUtils_1.default.nameFromComponents(configuration.prefix, 'duplicate', configuration.postfix);
        TestUtils_1.default.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        }
        finally {
            TestUtils_1.default.discardTempFile(name);
        }
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustNotFailOnEmptyConfiguration", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustNotFailOnNonExistingUserProvidedName", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustFailOnExistingUserProvidedName", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustGenerateExpectedNameFromTemplate", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustFailOnExistingNameUsingTemplate", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustFailOnExistingName", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TempNameGeneratorTestSuite.prototype, "generateMustFailOnExistingNameWithPostfix", null);
TempNameGeneratorTestSuite = __decorate([
    jest_1.suite
], TempNameGeneratorTestSuite);
