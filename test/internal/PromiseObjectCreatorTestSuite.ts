import {PromiseResult} from '../../src/';

import GarbageCollector from '../../src/internal/GarbageCollector';
import PromiseObjectCreator from '../../src/internal/PromiseObjectCreator';

import TestUtils from '../TestUtils';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class PromiseObjectCreatorTestSuite {

    private readonly DIR: string = 'async_object_dir';
    private readonly FILE: string = 'async_object_file';

    private sut: PromiseObjectCreator = new PromiseObjectCreator();

    public before() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    public after() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    @test
    public async createFileMustReturnExpectedResult() {
        const configuration = TestUtils.fileConfiguration({name:this.FILE});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        const promise: Promise<PromiseResult> = this.sut.createFile(name, configuration);
        const result = await promise;
        assert.equal(result.name, name);
        assert.ok(TestUtils.fileExists(result.name));
        assert.ok(typeof result.dispose === 'function');
        const disposePromise: Promise<void> = result.dispose();
        await disposePromise;
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public async createFileDisposeMustNotTryToUnlinkNonExistingObject() {
        const configuration = TestUtils.fileConfiguration({name:this.FILE});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        const result = await this.sut.createFile(name, configuration);
        TestUtils.discardTempFile(name);
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject(name));
        await result.dispose();
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public async createDirMustReturnExpectedResult() {
        const configuration = TestUtils.dirConfiguration({name:this.DIR});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        const promise: Promise<PromiseResult> = this.sut.createDir(name, configuration);
        const result = await promise;
        assert.equal(result.name, name);
        assert.ok(TestUtils.dirExists(result.name));
        assert.ok(typeof result.dispose === 'function');
        const disposePromise: Promise<void> = result.dispose();
        await disposePromise;
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public async createDirDisposeMustNotTryToUnlinkNonExistingObject() {
        const configuration = TestUtils.dirConfiguration({name:this.DIR});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        const result = await this.sut.createDir(name, configuration);
        TestUtils.discardTempDir(name);
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject(name));
        await result.dispose();
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public async createDirDisposeMustForceCleanOnGlobalSetting() {
        const configuration = TestUtils.dirConfiguration({name:this.DIR});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        try {
            const result = await this.sut.createDir(name, configuration);
            TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
            GarbageCollector.INSTANCE.forceClean = true;
            await result.dispose();
            assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
        } finally {
            GarbageCollector.INSTANCE.forceClean = false;
        }
    }

    @test
    public async createDirDisposeMustForceCleanOnConfigurationSetting() {
        const configuration = TestUtils.dirConfiguration({name:this.DIR, forceClean: true});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        const result = await this.sut.createDir(name, configuration);
        TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
        await result.dispose();
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public async createDirDisposeMustFailOnNonEmptyDir() {
        const configuration = TestUtils.dirConfiguration({name:this.DIR});
        const name = TestUtils.qualifiedPath(configuration.name);
        // TODO:refactor
        try {
            const result = await this.sut.createDir(name, configuration);
            TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
            await result.dispose();
            assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
        } catch (err) {
            assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
        }
    }
}
