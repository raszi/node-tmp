import {AsyncInterface, PromiseInterface, SyncInterface} from '../../src';

import Configuration from '../../src/internal/Configuration';
import GarbageCollector from '../../src/internal/GarbageCollector';

import {test} from '@testdeck/jest';
import * as assert from 'assert';

export default abstract class AbstractInterfaceTestSuiteBase<T extends AsyncInterface | SyncInterface | PromiseInterface> {

    protected sut: T;

    @test
    public tmpdir() {
        assert.equal(this.sut.tmpdir, new Configuration().tmpdir);
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