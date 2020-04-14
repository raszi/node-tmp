import PathUtils from '../../src/internal/PathUtils';

import TestUtils from '../TestUtils';

import * as os from 'os';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class PathUtilsTestSuite {

    @test
    public isRelative() {
        assert.ok(PathUtils.isRelative('/tmp/foo', '/tmp'));
        assert.ok(!PathUtils.isRelative('/tmp/foo', '/tmp/bar'));
    }

    @test
    public containsPathSeparator() {
        if (TestUtils.isCpmDerivative) {
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
        assert.equal(PathUtils.normalize('\\\\foo\\\\bar'), '\\foo\\bar');
        assert.equal(PathUtils.normalize('//foo//bar'), '/foo/bar');
    }

    @test
    public osTmpDir() {
        assert.equal(PathUtils.osTmpDir, os.tmpdir());
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
