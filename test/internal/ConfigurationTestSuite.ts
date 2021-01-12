import Configuration from '../../src/internal/Configuration';
import {join, normalizedOsTmpDir} from '../../src/internal/PathUtils';

import * as TestUtils from '../TestUtils';

import * as os from 'os';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class ConfigurationTestSuite {

    @test
    public defaultConfiguration() {
        function assertions(configuration) {
            assert.strictEqual(configuration.name, '');
            assert.strictEqual(configuration.dir, '');
            assert.strictEqual(configuration.tmpdir, normalizedOsTmpDir());
            assert.strictEqual(configuration.template, '');
            assert.strictEqual(configuration.prefix, 'tmp');
            assert.strictEqual(configuration.postfix, '');
            assert.strictEqual(configuration.tmpdir, os.tmpdir());
            assert.strictEqual(configuration.tries, Configuration.DEFAULT_TRIES);
            assert.strictEqual(configuration.fileMode, Configuration.DEFAULT_FILE_MODE);
            assert.strictEqual(configuration.fileFlags, Configuration.DEFAULT_FILE_FLAGS);
            assert.strictEqual(configuration.dirMode, Configuration.DEFAULT_DIR_MODE);
            assert.strictEqual(configuration.keep, false);
            assert.strictEqual(configuration.forceClean, false);
            assert.strictEqual(configuration.length, Configuration.DEFAULT_LENGTH);
        }

        assertions(new Configuration({}));
    }

    @test
    public invalidOrUndefinedTriesMustHaveBeenCompensatedFor() {
        let configuration = new Configuration({ tries: -1 });
        assert.strictEqual(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: NaN });
        assert.strictEqual(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 0 });
        assert.strictEqual(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 100 });
        assert.strictEqual(configuration.tries, Configuration.MAX_TRIES);

        configuration = new Configuration({});
        assert.strictEqual(configuration.tries, Configuration.DEFAULT_TRIES);
    }

    @test
    public userProvidedValidTries() {
        let configuration = new Configuration({ tries: Configuration.MIN_TRIES });
        assert.strictEqual(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 5 });
        assert.strictEqual(configuration.tries, 5);

        configuration = new Configuration({ tries: Configuration.MAX_TRIES });
        assert.strictEqual(configuration.tries, Configuration.MAX_TRIES);
    }

    @test
    public validationMustFailOnInvalidTemplate() {
        assert.throws(() => {
            const _ = new Configuration({ template: 'XXX' });
        });
    }

    @test
    public onTemplateLengthMustEqualTemplateLength() {
        const configuration = new Configuration({ template: 'XXXXXX' });
        assert.strictEqual(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public validationMustFailOnNonExistingDir() {
        assert.throws(() => {
            const _ = new Configuration({ dir: 'nonexistent' });
        });
    }

    @test
    public validationMustFailOnDirTryingToEscapeRootTmpDir() {
        assert.throws(() => {
            const _ = new Configuration({ dir: join('..', 'etc') });
        });
    }

    @test
    public validationMustFailOnNonExistingOsTmpDir() {
        const origfn = os.tmpdir;
        (os as any).tmpdir = () => { return TestUtils.nativeRootPath(['tmp-NONEXISTING_TEMP_DIR']); };
        try {
            assert.throws(() => {
                const _ = new Configuration({ dir: join('..', 'etc') });
            });
        } finally {
            (os as any).tmpdir = origfn;
        }
    }

    @test
    public validationMustFailOnNameContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ name: join('..', 'name') });
        });
    }

    @test
    public validationMustFailOnTemplateContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ template: join('..', 'templateXXXXXX') });
        });
    }

    @test
    public validationMustFailOnPrefixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ prefix: join('..', 'prefix') });
        });
    }

    @test
    public validationMustFailOnPostfixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ postfix: join('..', 'postfix') });
        });
    }

    @test
    public mustNotFailOnLengthLessThanExpectedMinimumLength() {
        const configuration = new Configuration({ length: 5 });
        assert.strictEqual(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public mustNotFailOnLengthGreaterThanExpectedMaximumLength() {
        const configuration = new Configuration({ length: 25 });
        assert.strictEqual(configuration.length, Configuration.MAX_LENGTH);
    }

    @test
    public lengthMustHaveUserDefinedValue() {
        const configuration = new Configuration({ length: 20 });
        assert.strictEqual(configuration.length, 20);
    }
}
