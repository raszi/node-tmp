import Configuration from '../../src/internal/Configuration';
import PathUtils from '../../src/internal/PathUtils';

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
            assert.equal(configuration.tmpdir, PathUtils.normalizedOsTmpDir);
            assert.equal(configuration.template, '');
            assert.equal(configuration.prefix, 'tmp');
            assert.equal(configuration.postfix, '');
            assert.equal(configuration.tmpdir, os.tmpdir());
            assert.equal(configuration.tries, Configuration.DEFAULT_TRIES);
            assert.equal(configuration.fileMode, Configuration.DEFAULT_FILE_MODE);
            assert.equal(configuration.fileFlags, Configuration.DEFAULT_FILE_FLAGS);
            assert.equal(configuration.dirMode, Configuration.DEFAULT_DIR_MODE);
            assert.equal(configuration.keep, false);
            assert.equal(configuration.forceClean, false);
            assert.equal(configuration.length, Configuration.DEFAULT_LENGTH);
        }

        assertions(new Configuration({}));
    }

    @test
    public invalidOrUndefinedTriesMustHaveBeenCompensatedFor() {
        let configuration = new Configuration({ tries: -1 });
        assert.equal(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: NaN });
        assert.equal(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 0 });
        assert.equal(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 100 });
        assert.equal(configuration.tries, Configuration.MAX_TRIES);

        configuration = new Configuration({});
        assert.equal(configuration.tries, Configuration.DEFAULT_TRIES);
    }

    @test
    public userProvidedValidTries() {
        let configuration = new Configuration({ tries: Configuration.MIN_TRIES });
        assert.equal(configuration.tries, Configuration.MIN_TRIES);

        configuration = new Configuration({ tries: 5 });
        assert.equal(configuration.tries, 5);

        configuration = new Configuration({ tries: Configuration.MAX_TRIES });
        assert.equal(configuration.tries, Configuration.MAX_TRIES);
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
        assert.equal(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public validationMustFailOnNonExistingDir() {
        assert.throws(() => {
            const _ = new Configuration({ dir: 'nonexistent' });
        });
    }

    @test.only
    public validationMustFailOnDirTryingToEscapeRootTmpDir() {
        assert.throws(() => {
            const _ = new Configuration({ dir: PathUtils.join('..', 'etc') });
        });
    }

    @test
    public validationMustFailOnNonExistingOsTmpDir() {
        const origfn = os.tmpdir;
        (os as any).tmpdir = () => { return TestUtils.nativeRootPath(['tmp-NONEXISTING_TEMP_DIR']); };
        try {
            assert.throws(() => {
                const _ = new Configuration({ dir: PathUtils.join('..', 'etc') });
            });
        } finally {
            (os as any).tmpdir = origfn;
        }
    }

    @test
    public validationMustFailOnNameContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ name: PathUtils.join('..', 'name') });
        });
    }

    @test
    public validationMustFailOnTemplateContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ template: PathUtils.join('..', 'templateXXXXXX') });
        });
    }

    @test
    public validationMustFailOnPrefixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ prefix: PathUtils.join('..', 'prefix') });
        });
    }

    @test
    public validationMustFailOnPostfixContainingPathSeparators() {
        assert.throws(() => {
            const _ = new Configuration({ postfix: PathUtils.join('..', 'postfix') });
        });
    }

    @test
    public mustNotFailOnLengthLessThanExpectedMinimumLength() {
        const configuration = new Configuration({ length: 5 });
        assert.equal(configuration.length, Configuration.MIN_LENGTH);
    }

    @test
    public mustNotFailOnLengthGreaterThanExpectedMaximumLength() {
        const configuration = new Configuration({ length: 25 });
        assert.equal(configuration.length, Configuration.MAX_LENGTH);
    }

    @test
    public lengthMustHaveUserDefinedValue() {
        const configuration = new Configuration({ length: 20 });
        assert.equal(configuration.length, 20);
    }
}
