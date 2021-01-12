import * as MathUtils from '../../src/internal/MathUtils';

import {suite, test, skip} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class MathUtilsTestSuite {

    @test
    public clampMustWorkAsExpected() {
        assert.strictEqual(MathUtils.clamp(8, 9, 11), 9);
        assert.strictEqual(MathUtils.clamp(9, 9, 11), 9);
        assert.strictEqual(MathUtils.clamp(10, 9, 11), 10);
        assert.strictEqual(MathUtils.clamp(11, 9, 11), 11);
        assert.strictEqual(MathUtils.clamp(12, 9, 11), 11);

        assert.strictEqual(MathUtils.clamp(-3, -2, 0), -2);
        assert.strictEqual(MathUtils.clamp(-2, -2, 0), -2);
        assert.strictEqual(MathUtils.clamp(-1, -2, 0), -1);
        assert.strictEqual(MathUtils.clamp(0, -2, 0), 0);
        assert.strictEqual(MathUtils.clamp(1, -2, 0), 0);
    }
}
