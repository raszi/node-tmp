import Configuration from '../../src/internal/Configuration';

import TestUtils from '../TestUtils';

import * as os from 'os';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class ConfigurationTestSuite {

    @test
    public defaultConfiguration() {
        function assertions(configuration) {
            assert.equal(configuration.name, '');
            assert.equal(configuration.dir, '');
            assert.equal(configuration.template, '');
            assert.equal(configuration.prefix, 'tmp');
            assert.equal(configuration.postfix, '');
            assert.equal(configuration.tmpdir, os.tmpdir());
            assert.equal(configuration.tries, Configuration.DEFAULT_TRIES);
            assert.equal(configuration.mode, 0o000);
            assert.equal(configuration.keep, false);
            assert.equal(configuration.forceClean, false);
            assert.equal(configuration.length, Configuration.DEFAULT_LENGTH);
        }

        assertions(new Configuration({}));
        assertions(new Configuration());
    }

    @test
    public invalidOrUndefinedTriesMustHaveBeenCompensatedFor() {
        let configuration = new Configuration({
            tries: -1
        });
        assert.equal(configuration.tries, 1);

        configuration = new Configuration({
            tries: NaN
        });
        assert.equal(configuration.tries, Configuration.DEFAULT_TRIES);

        configuration = new Configuration({
            tries: 0
        });
        assert.equal(configuration.tries, Configuration.DEFAULT_TRIES);

        configuration = new Configuration({});
        assert.equal(configuration.tries, 3);
    }

    @test
    public userProvidedValidTries() {
        const configuration = new Configuration({
            tries: 1
        });
        assert.equal(configuration.tries, 1);
    }

    @test
    public validationMustFailOnInvalidTemplate() {
        assert.throws(() => {
            const _ = new Configuration({
                template: 'XXX'
            });
        });
    }

    @test
    public onTemplateLengthMustEqualTemplateLength() {
        const configuration = new Configuration({
            template: 'XXXXXX'
        });
        assert.equal(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public validationMustFailOnNonExistingDir() {
        assert.throws(() => {
            const _ = new Configuration({
                dir: 'nonexistent'
            });
        });
    }

    @test
    public validationMustFailOnDirTryingToEscapeRootTmpDir() {
        assert.throws(() => {
            const _ = new Configuration({
                dir: TestUtils.nativePath(['..', 'etc'])
            });
        });
    }

    @test
    public validationMustFailOnNonExistingOsTmpDir() {
        const origfn = os.tmpdir;
        (os as any).tmpdir = () => { return TestUtils.nativeRootPath(['tmp-NONEXISTING_TEMP_DIR']); };
        try {
            assert.throws(() => {
                const _ = new Configuration({
                    dir: TestUtils.nativePath(['..', 'etc'])
                });
            });
        } finally {
            (os as any).tmpdir = origfn;
        }
    }

    @test
    public validationMustFailOnNameContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({
                name: TestUtils.nativePath(['..', 'name'])
            });
        });
    }

    @test
    public validationMustFailOnTemplateContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({
                template: TestUtils.nativePath(['..', 'templateXXXXXX'])
            });
        });
    }

    @test
    public validationMustFailOnPrefixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({
                prefix: TestUtils.nativePath(['..', 'prefix'])
            });
        });
    }

    @test
    public validationMustFailOnPostfixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({
                postfix: TestUtils.nativePath(['..', 'postfix'])
            });
        });
    }

    @test
    public mustNotFailOnLengthLessThanExpectedMinimumLength() {
        const configuration = new Configuration({
            length: 5
        });
        assert.equal(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public mustNotFailOnLengthGreaterThanExpectedMaximumLength() {
        const configuration = new Configuration({
            length: 25
        });
        assert.equal(configuration.length, Configuration.MAX_LENGTH);
    }

    @test
    public lengthMustHaveUserDefinedValue() {
        const configuration = new Configuration({
            length: 20
        });
        assert.equal(configuration.length, 20);
    }
}
