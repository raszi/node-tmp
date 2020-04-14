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
const TestUtils_1 = require("../TestUtils");
const os = require("os");
const jest_1 = require("@testdeck/jest");
const assert = require("assert");
let ConfigurationTestSuite = class ConfigurationTestSuite {
    defaultConfiguration() {
        function assertions(configuration) {
            assert.equal(configuration.name, '');
            assert.equal(configuration.dir, '');
            assert.equal(configuration.template, '');
            assert.equal(configuration.prefix, 'tmp');
            assert.equal(configuration.postfix, '');
            assert.equal(configuration.tmpdir, os.tmpdir());
            assert.equal(configuration.tries, Configuration_1.default.DEFAULT_TRIES);
            assert.equal(configuration.mode, 0o000);
            assert.equal(configuration.keep, false);
            assert.equal(configuration.forceClean, false);
            assert.equal(configuration.length, Configuration_1.default.DEFAULT_LENGTH);
        }
        assertions(new Configuration_1.default({}));
        assertions(new Configuration_1.default());
    }
    invalidOrUndefinedTriesMustHaveBeenCompensatedFor() {
        let configuration = new Configuration_1.default({
            tries: -1
        });
        assert.equal(configuration.tries, 1);
        configuration = new Configuration_1.default({
            tries: NaN
        });
        assert.equal(configuration.tries, Configuration_1.default.DEFAULT_TRIES);
        configuration = new Configuration_1.default({
            tries: 0
        });
        assert.equal(configuration.tries, Configuration_1.default.DEFAULT_TRIES);
        configuration = new Configuration_1.default({});
        assert.equal(configuration.tries, 3);
    }
    userProvidedValidTries() {
        const configuration = new Configuration_1.default({
            tries: 1
        });
        assert.equal(configuration.tries, 1);
    }
    validationMustFailOnInvalidTemplate() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                template: 'XXX'
            });
        });
    }
    onTemplateLengthMustEqualTemplateLength() {
        const configuration = new Configuration_1.default({
            template: 'XXXXXX'
        });
        assert.equal(configuration.length, Configuration_1.default.MIN_LENGTH);
    }
    validationMustFailOnNonExistingDir() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                dir: 'nonexistent'
            });
        });
    }
    validationMustFailOnDirTryingToEscapeRootTmpDir() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                dir: TestUtils_1.default.nativePath(['..', 'etc'])
            });
        });
    }
    validationMustFailOnNonExistingOsTmpDir() {
        const origfn = os.tmpdir;
        os.tmpdir = () => { return TestUtils_1.default.nativeRootPath(['tmp-NONEXISTING_TEMP_DIR']); };
        try {
            assert.throws(() => {
                const _ = new Configuration_1.default({
                    dir: TestUtils_1.default.nativePath(['..', 'etc'])
                });
            });
        }
        finally {
            os.tmpdir = origfn;
        }
    }
    validationMustFailOnNameContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                name: TestUtils_1.default.nativePath(['..', 'name'])
            });
        });
    }
    validationMustFailOnTemplateContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                template: TestUtils_1.default.nativePath(['..', 'templateXXXXXX'])
            });
        });
    }
    validationMustFailOnPrefixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                prefix: TestUtils_1.default.nativePath(['..', 'prefix'])
            });
        });
    }
    validationMustFailOnPostfixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration_1.default({
                postfix: TestUtils_1.default.nativePath(['..', 'postfix'])
            });
        });
    }
    mustNotFailOnLengthLessThanExpectedMinimumLength() {
        const configuration = new Configuration_1.default({
            length: 5
        });
        assert.equal(configuration.length, Configuration_1.default.MIN_LENGTH);
    }
    mustNotFailOnLengthGreaterThanExpectedMaximumLength() {
        const configuration = new Configuration_1.default({
            length: 25
        });
        assert.equal(configuration.length, Configuration_1.default.MAX_LENGTH);
    }
    lengthMustHaveUserDefinedValue() {
        const configuration = new Configuration_1.default({
            length: 20
        });
        assert.equal(configuration.length, 20);
    }
};
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "defaultConfiguration", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "invalidOrUndefinedTriesMustHaveBeenCompensatedFor", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "userProvidedValidTries", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnInvalidTemplate", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "onTemplateLengthMustEqualTemplateLength", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnNonExistingDir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnDirTryingToEscapeRootTmpDir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnNonExistingOsTmpDir", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnNameContainingPathSeparators", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnTemplateContainingPathSeparators", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnPrefixContainingPathSeparators", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "validationMustFailOnPostfixContainingPathSeparators", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "mustNotFailOnLengthLessThanExpectedMinimumLength", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "mustNotFailOnLengthGreaterThanExpectedMaximumLength", null);
__decorate([
    jest_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConfigurationTestSuite.prototype, "lengthMustHaveUserDefinedValue", null);
ConfigurationTestSuite = __decorate([
    jest_1.suite
], ConfigurationTestSuite);
