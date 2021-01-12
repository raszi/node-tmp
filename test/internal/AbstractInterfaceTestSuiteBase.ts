import {AsyncInterface, PromiseInterface, SyncInterface} from '../../src/types';

import GarbageCollector from '../../src/internal/GarbageCollector';
import {normalizedOsTmpDir} from '../../src/internal/PathUtils';

import {test} from '@testdeck/jest';
import * as assert from 'assert';

export default abstract class AbstractInterfaceTestSuiteBase<T extends AsyncInterface | SyncInterface | PromiseInterface> {

    protected sut: T;

    @test
    public tmpdir() {
        assert.strictEqual(this.sut.tmpdir, normalizedOsTmpDir());
    }

    @test
    public forceClean() {
        assert.ok(!GarbageCollector.INSTANCE.forceClean);
        this.sut.forceClean();
        try {
            assert.ok(GarbageCollector.INSTANCE.forceClean);
        } finally {
            GarbageCollector.INSTANCE.forceClean = false;
        }
    }
}