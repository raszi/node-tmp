import PathUtils from '../../src/internal/PathUtils';

import TestUtils from '../TestUtils';

import * as os from 'os';

import {suite, test, skip} from '@testdeck/jest';
import * as assert from 'assert';


@suite
class PathUtilsTestSuite {

    @test
    @skip(!PathUtils.isWin32)
    public isWin32MustReturnTrue() {
        assert.ok(PathUtils.isWin32);
    }

    @test
    @skip(PathUtils.isWin32)
    public isWin32MustReturnFalse() {
        assert.ok(!PathUtils.isWin32);
    }

    @test
    public isRelative() {
        assert.ok(PathUtils.isRelative('/tmp/foo', '/tmp'));
        assert.ok(!PathUtils.isRelative('/tmp/foo', '/tmp/bar'));
    }

    @test
    public containsPathSeparator() {
        if (PathUtils.isWin32) {
            assert.ok(PathUtils.containsPathSeparator('C:\\tmp\foo'));
        } else {
            assert.ok(PathUtils.containsPathSeparator('/tmp/foo'));
        }
        assert.ok(!PathUtils.containsPathSeparator('foo'));
    }

    @test
    public exists() {
        assert.ok(PathUtils.exists(PathUtils.osTmpDir));
        assert.ok(!PathUtils.exists(TestUtils.nativeRootPath(['tmp-NON_EXISTING'])));
    }

    @test
    public normalize() {
        assert.strictEqual(PathUtils.normalize(undefined), '');
        assert.strictEqual(PathUtils.normalize(null), '');
        assert.strictEqual(PathUtils.normalize(''), '');
        assert.strictEqual(PathUtils.normalize(' '), '');
        assert.strictEqual(PathUtils.normalize('\'foo\''), 'foo');
        assert.strictEqual(PathUtils.normalize('\"foo\"'), 'foo');
        assert.strictEqual(PathUtils.normalize('\"   foo\"'), 'foo');
        assert.strictEqual(PathUtils.normalize('\"foo    \"'), 'foo');
        assert.strictEqual(PathUtils.normalize('\"foo   bar\"'), 'foo   bar');
        assert.strictEqual(PathUtils.normalize('\"foo\'s bar\"'), 'foos bar');
        assert.strictEqual(PathUtils.normalize('\"foo\"s\'\" bar\"'), 'foos bar');
    }

    @test
    @skip(!PathUtils.isWin32)
    public normalizeWin32() {
        assert.strictEqual(PathUtils.normalize('\\\\foo\\\\bar'), 'foo\\bar');
        assert.strictEqual(PathUtils.normalize('C:\\foo\\  \\ bar'), 'C:\\foo\\bar');
        assert.strictEqual(PathUtils.normalize('foo\\..\\bar'), 'bar');
    }

    @test
    @skip(PathUtils.isWin32)
    public normalizeUnixs() {
        assert.strictEqual(PathUtils.normalize('/foo/bar'), '/foo/bar');
        assert.strictEqual(PathUtils.normalize('//foo//bar'), '/foo/bar');
        assert.strictEqual(PathUtils.normalize('/foo/  // bar'), '/foo/bar');
        assert.strictEqual(PathUtils.normalize('foo/../bar'), 'bar');
    }

    @test
    public osTmpDir() {
        assert.strictEqual(PathUtils.osTmpDir, os.tmpdir());
    }

    @test
    public normalizedOsTmpDir() {
        assert.strictEqual(PathUtils.normalizedOsTmpDir, os.tmpdir());
    }

    @test
    public resolvePath() {
        const root = TestUtils.nativeRootPath(['tmp']);
        const absolute = TestUtils.nativeRootPath(['tmp', 'foo']);
        const relative = TestUtils.nativeRootPath(['tmp', 'rel']);
        assert.strictEqual(PathUtils.resolvePath(absolute, root), absolute);
        assert.strictEqual(PathUtils.resolvePath('rel', root), relative);
    }
}
