import * as tmp from '../src';

import {normalizedOsTmpDir} from '../src/internal/PathUtils';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class LegacyInterfaceSupportTestSuite {

    private readonly DIR: string = 'legacy_iface_dir';
    private readonly FILE: string = 'legacy_iface_file';

    @test
    public tmpdirMustExit() {
        assert.strictEqual(tmp.tmpdir, normalizedOsTmpDir());
    }

    @test
    public tmpNameMustExist() {
        assert.ok(typeof tmp.tmpName === 'function');
    }

    @test
    public fileMustExist() {
        assert.ok(typeof tmp.file === 'function');
    }

    @test
    public dirMustExist() {
        assert.ok(typeof tmp.dir === 'function');
    }

    @test
    public tmpNameSyncMustExist() {
        assert.ok(typeof tmp.tmpNameSync === 'function');
    }

    @test
    public fileSyncMustExist() {
        assert.ok(typeof tmp.fileSync === 'function');
    }

    @test
    public dirSyncMustExist() {
        assert.ok(typeof tmp.dirSync === 'function');
    }
}
