import Configuration from '../../src/internal/Configuration';
import StringUtils from '../../src/internal/StringUtils';
import TempNameGenerator from '../../src/internal/TempNameGenerator';

import TestUtils from '../TestUtils';

import * as path from 'path';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class TempNameGeneratorTestSuite {

    private sut: TempNameGenerator = new TempNameGenerator();

    @test
    public generateMustNotFailOnEmptyConfiguration() {
        const configuration = new Configuration({});
        this.sut.generate(configuration);
    }

    @test
    public generateMustNotFailOnNonExistingUserProvidedName() {
        const configuration = new Configuration({
            name: 'nonexistent'
        });
        const name = this.sut.generate(configuration);
        assert.equal(name, path.join(configuration.tmpdir, configuration.name));
    }

    @test
    public generateMustFailOnExistingUserProvidedName() {
        const configuration = new Configuration({
            name: 'existingname'
        });
        TestUtils.createTempFile(configuration.name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        } finally {
            TestUtils.discardTempFile(configuration.name);
        }
    }

    @test
    public generateMustGenerateExpectedNameFromTemplate() {
        const configuration = new Configuration({
            template: 'templateXXXXXX'
        });
        const name = this.sut.generate(configuration);
        assert.ok(name.match(/template.{6}$/));
    }

    @test
    public generateMustFailOnExistingNameUsingTemplate() {
        const configuration = new Configuration({
            template: 'templateXXXXXX'
        });
        (this.sut as any)._nameGenerator = {
            generate: (length: number) => {
                return 'duplicate';
            }
        };
        const name = StringUtils.nameFromTemplate(Configuration.TEMPLATE_PATTERN, configuration.template, 'duplicate');
        TestUtils.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        } finally {
            TestUtils.discardTempFile(name);
        }
    }

    @test
    public generateMustFailOnExistingName() {
        const configuration = new Configuration({});
        (this.sut as any)._nameGenerator = {
            generate: (length: number) => {
                return 'duplicate';
            }
        };
        const name = StringUtils.nameFromComponents(configuration.prefix, 'duplicate');
        TestUtils.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        } finally {
            TestUtils.discardTempFile(name);
        }
    }

    @test
    public generateMustFailOnExistingNameWithPostfix() {
        const configuration = new Configuration({
            postfix: 'postfix'
        });
        (this.sut as any)._nameGenerator = {
            generate: (length: number) => {
                return 'duplicate';
            }
        };
        const name = StringUtils.nameFromComponents(configuration.prefix, 'duplicate', configuration.postfix);
        TestUtils.createTempFile(name);
        try {
            assert.throws(() => { this.sut.generate(configuration); });
        } finally {
            TestUtils.discardTempFile(name);
        }
    }
}
