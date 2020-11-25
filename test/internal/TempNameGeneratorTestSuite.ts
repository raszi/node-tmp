import Configuration from '../../src/internal/Configuration';
import StringUtils from '../../src/internal/StringUtils';
import TempNameGenerator from '../../src/internal/TempNameGenerator';

import TestUtils from '../TestUtils';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class TempNameGeneratorTestSuite {

    private sut: TempNameGenerator;

    private static NONEXISTENT = 'nonexistent';
    private static EXISTING = 'existing';
    private static TEMPLATEDUPLICATE = 'templateduplicate';

    public before() {
        this.sut = new TempNameGenerator();
        TestUtils.discard(TempNameGeneratorTestSuite.NONEXISTENT);
        TestUtils.discard(TempNameGeneratorTestSuite.EXISTING);
        TestUtils.discard(TempNameGeneratorTestSuite.TEMPLATEDUPLICATE);
    }

    public after() {
        TestUtils.discard(TempNameGeneratorTestSuite.NONEXISTENT);
        TestUtils.discard(TempNameGeneratorTestSuite.EXISTING);
        TestUtils.discard(TempNameGeneratorTestSuite.TEMPLATEDUPLICATE);
    }

    @test
    public generateMustNotFailOnEmptyConfiguration() {
        const configuration = new Configuration({});
        this.sut.generate(configuration);
    }

    @test
    public generateMustNotFailOnNonExistingUserProvidedName() {
        const configuration = new Configuration({ name: TempNameGeneratorTestSuite.NONEXISTENT });
        assert.doesNotThrow(() => this.sut.generate(configuration));
    }

    @test
    public generateMustFailOnExistingUserProvidedName() {
        const configuration = new Configuration({ name: TempNameGeneratorTestSuite.EXISTING });
        TestUtils.createTempFile(configuration.name);
        assert.throws(() => { this.sut.generate(configuration); });
    }

    @test
    public generateMustGenerateExpectedNameFromTemplate() {
        const configuration = new Configuration({ template: 'templateXXXXXX' });
        const name = this.sut.generate(configuration);
        assert.ok(name.match(/template.{6}$/));
    }

    @test
    public generateMustFailOnExistingNameUsingTemplate() {
        const configuration = new Configuration({ template: 'templateXXXXXX' });
        (this.sut as any)._nameGenerator = {
            generate: (length: number) => {
                return 'duplicate';
            }
        };
        const name = StringUtils.nameFromTemplate(Configuration.TEMPLATE_REGEXP, configuration.template, 'duplicate');
        TestUtils.createTempFile(name);
        assert.throws(() => { this.sut.generate(configuration); });
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
            assert.throws(() => {
                this.sut.generate(configuration);
            });
        } finally {
            TestUtils.discard(name);
        }
    }

    @test
    public generateMustFailOnExistingNameWithPostfix() {
        const configuration = new Configuration({ postfix: 'postfix' });
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
            TestUtils.discard(name);
        }
    }
}
