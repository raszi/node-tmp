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
        assert.equal(PathUtils.normalize(undefined), '');
        assert.equal(PathUtils.normalize(null), '');
        assert.equal(PathUtils.normalize(''), '');
        assert.equal(PathUtils.normalize(' '), '');
        assert.equal(PathUtils.normalize('\'foo\''), 'foo');
        assert.equal(PathUtils.normalize('\"foo\"'), 'foo');
        assert.equal(PathUtils.normalize('\"   foo\"'), 'foo');
        assert.equal(PathUtils.normalize('\"foo    \"'), 'foo');
        assert.equal(PathUtils.normalize('\"foo   bar\"'), 'foo   bar');
        assert.equal(PathUtils.normalize('\"foo\'s bar\"'), 'foos bar');
        assert.equal(PathUtils.normalize('\"foo\"s\'\" bar\"'), 'foos bar');
    }

    @test
    @skip(!PathUtils.isWin32)
    public normalizeWin32() {
        assert.equal(PathUtils.normalize('\\\\foo\\\\bar'), 'foo\\bar');
        assert.equal(PathUtils.normalize('C:\\foo\\  \\ bar'), 'C:\\foo\\bar');
        assert.equal(PathUtils.normalize('foo\\..\\bar'), 'bar');
    }

    @test
    @skip(PathUtils.isWin32)
    public normalizeUnixs() {
        assert.equal(PathUtils.normalize('/foo/bar'), '/foo/bar');
        assert.equal(PathUtils.normalize('//foo//bar'), '/foo/bar');
        assert.equal(PathUtils.normalize('/foo/  // bar'), '/foo/bar');
        assert.equal(PathUtils.normalize('foo/../bar'), 'bar');
    }

    @test
    public osTmpDir() {
        assert.equal(PathUtils.osTmpDir, os.tmpdir());
    }

    @test
    public normalizedOsTmpDir() {
        assert.equal(PathUtils.normalizedOsTmpDir, os.tmpdir());
    }

    @test
    public resolvePath() {
        const root = TestUtils.nativeRootPath(['tmp']);
        const absolute = TestUtils.nativeRootPath(['tmp', 'foo']);
        const relative = TestUtils.nativeRootPath(['tmp', 'rel']);
        assert.equal(PathUtils.resolvePath(absolute, root), absolute);
        assert.equal(PathUtils.resolvePath('rel', root), relative);
    }
}
