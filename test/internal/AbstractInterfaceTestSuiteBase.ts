import {AsyncInterface, PromiseInterface, SyncInterface} from '../../src';

import GarbageCollector from '../../src/internal/GarbageCollector';
import PathUtils from '../../src/internal/PathUtils';

import {test} from '@testdeck/jest';
import * as assert from 'assert';

export default abstract class AbstractInterfaceTestSuiteBase<T extends AsyncInterface | SyncInterface | PromiseInterface> {

    protected sut: T;

    @test
    public tmpdir() {
        assert.equal(this.sut.tmpdir, PathUtils.normalizedOsTmpDir);
    }

    @test
    public forceClean() {
        this.sut.forceClean();
        try {
            assert.ok(GarbageCollector.INSTANCE.forceClean);
        } finally {
            GarbageCollector.INSTANCE.forceClean = false;
        }
    }
}