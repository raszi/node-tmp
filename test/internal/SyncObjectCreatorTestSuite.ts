import Configuration from '../../src/internal/Configuration';
import GarbageCollector from '../../src/internal/GarbageCollector';
import SyncObjectCreator from '../../src/internal/SyncObjectCreator';

import TestUtils from '../TestUtils';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class SyncObjectCreatorTestSuite {

    private readonly DIR: string = 'sync_object_dir';
    private readonly FILE: string = 'sync_object_file';

    private sut: SyncObjectCreator = new SyncObjectCreator();

    public before() {
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
    }

    public after() {
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
    }

    @test
    public createFileMustReturnExpectedResult() {
        const configuration = new Configuration({ name: this.FILE });
        const name = TestUtils.qualifiedPath(configuration.name);
        const result = this.sut.createFile(name, configuration);
        assert.equal(result.name, name);
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils.fileExists(result.name));
        assert.ok(typeof result.removeCallback === 'function');
        result.dispose();
        assert.ok(!TestUtils.fileExists(result.name));
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public createDirMustReturnExpectedResult() {
        const configuration = new Configuration({ name: this.DIR });
        const name = TestUtils.qualifiedPath(configuration.name);
        const result = this.sut.createDir(name, configuration);
        assert.equal(result.name, name);
        assert.ok(TestUtils.dirExists(result.name));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(typeof result.removeCallback === 'function');
        result.dispose();
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
        assert.ok(!TestUtils.dirExists(result.name));
    }

    // TODO: createFileDisposeMustNotTryToUnlinkNonExistingObject
    // TODO: createDirDisposeMustNotTryToUnlinkNonExistingObject

    @test
    public createDirDisposeMustForceCleanOnGlobalSetting() {
        const configuration = new Configuration({ name: this.DIR });
        const name = TestUtils.qualifiedPath(configuration.name);
        try {
            const result = this.sut.createDir(name, configuration);
            TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
            GarbageCollector.INSTANCE.forceClean = true;
            result.dispose();
            assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
        } finally {
            GarbageCollector.INSTANCE.forceClean = false;
        }
    }

    @test
    public createDirDisposeMustForceCleanOnConfigurationSetting() {
        const configuration = new Configuration({ name: this.DIR, forceClean: true });
        const name = TestUtils.qualifiedPath(configuration.name);
        const result = this.sut.createDir(name, configuration);
        TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
        result.dispose();
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
    }

    @test
    public createDirDisposeMustFailOnNonEmptyDir() {
        const configuration = new Configuration({name:this.DIR});
        const name = TestUtils.qualifiedPath(configuration.name);
        try {
            const result = this.sut.createDir(name, configuration);
            TestUtils.createTempFile(TestUtils.qualifiedSubPath(this.FILE, result.name));
            result.dispose();
            assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(name));
        } catch (err) {
            assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
        }
    }
}
