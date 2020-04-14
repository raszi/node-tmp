import RandomNameGenerator from '../../src/internal/RandomNameGenerator';

import * as crypto from 'crypto';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class RandomNameGeneratorTestSuite {

    private sut: RandomNameGenerator = new RandomNameGenerator();

    @test
    public mustFallbackOnPseudoRandom() {
        const origRandomBytesfn = crypto.randomBytes;
        const origPseudoRandomBytesfn = crypto.pseudoRandomBytes;
        let called = false;
        (crypto as any).randomBytes = (length) => { throw new Error(); };
        (crypto as any).pseudoRandomBytes = (length) => { called = true; return origPseudoRandomBytesfn(length); };
        try {
            this.sut.generate(1);
            assert.ok(called);
        } finally {
            (crypto as any).randomBytes = origRandomBytesfn;
            (crypto as any).pseudoRandomBytes = origPseudoRandomBytesfn;
        }
    }
}
