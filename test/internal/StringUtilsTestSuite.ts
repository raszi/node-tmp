import StringUtils from '../../src/internal/StringUtils';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class StringUtilsTestSuite {

    @test
    public isBlank() {
        assert.ok(StringUtils.isBlank(null));
        assert.ok(StringUtils.isBlank(undefined));
        assert.ok(StringUtils.isBlank(''));
        assert.ok(StringUtils.isBlank(' '));
        assert.ok(!StringUtils.isBlank('a'));
    }

    @test
    public sort() {
        assert.deepStrictEqual(StringUtils.sort(['a', 'b', 'a']), ['a', 'a', 'b']);
        assert.deepStrictEqual(StringUtils.sort(new Set<string>(['b', 'a'])), ['a', 'b']);
    }

    @test
    public rsort() {
        assert.deepStrictEqual(StringUtils.rsort(['a', 'b', 'a']), ['b', 'a', 'a']);
        assert.deepStrictEqual(StringUtils.rsort(new Set<string>(['a', 'b'])), ['b', 'a']);
    }

    @test
    public prefixesOnly() {
        const expected = ['a', 'b', 'c'];
        assert.deepStrictEqual(StringUtils.prefixesOnly(['a', 'ab', 'b', 'ba', 'c']), expected);
    }

    @test
    public matchesPrefix() {
        assert.ok(StringUtils.matchesPrefix('ab', ['a']));
        assert.ok(!StringUtils.matchesPrefix('ab', ['b']));
    }

    @test
    public determinePrefix() {
        assert.equal(StringUtils.determinePrefix('ab', ['a']), 'a');
        assert.equal(StringUtils.determinePrefix('ab', ['b']), 'ab');
    }

    @test
    public nameFromComponents() {
        assert.equal(StringUtils.nameFromComponents('a', 'b'), `a-${process.pid}-b`);
        assert.equal(StringUtils.nameFromComponents('a', 'b', 'c'), `a-${process.pid}-b-c`);
    }

    @test
    public nameFromTemplate() {
        assert.equal(StringUtils.nameFromTemplate(/XXX/, 'aXXXb', 'AAA'), `aAAAb`);
    }
}
