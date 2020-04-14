import {SyncInterface} from '../../src';

import SyncInterfaceImpl from '../../src/internal/SyncInterfaceImpl';

import TestUtils from '../TestUtils';
import AbstractInterfaceTestSuiteBase from './AbstractInterfaceTestSuiteBase';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class SyncInterfaceTestSuite extends AbstractInterfaceTestSuiteBase<SyncInterface> {

    private readonly DIR: string = 'sync_iface_dir';
    private readonly FILE: string = 'sync_iface_file';

    public before() {
        this.sut = new SyncInterfaceImpl();
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    public after() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    @test
    public nameMustWorkAsExpected() {
        assert.equal(this.sut.name({name:this.FILE}), TestUtils.qualifiedPath(this.FILE));
    }

    @test
    public nameMustHandleErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
                throw new Error();
            }};
        try {
            this.sut.name({name: this.FILE});
        } catch (err) {
            assert.ok(err instanceof Error);
        }
    }

    @test
    public fileMustWorkAsExpected() {
        const result = this.sut.file({name: this.FILE});
        assert.equal(result.name, TestUtils.qualifiedPath(this.FILE));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils.fileExists(result.name));
        result.dispose();
        assert.ok(!TestUtils.fileExists(TestUtils.qualifiedPath(this.FILE)));
    }

    @test
    public fileMustHandleNameErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
                throw new Error();
            }};
        try {
            this.sut.file({name:this.FILE});
        } catch (err) {
            assert.ok(err instanceof Error);
        }
    }

    @test
    public fileMustHandleObjectCreationErrorsAsExpected() {
        (this.sut as any)._creator = { createFile: (configuration) => {
                throw new Error();
            }};
        try {
            this.sut.file({name:this.FILE});
        } catch (err) {
            assert.ok(err instanceof Error);
        }
    }

    @test
    public dirMustWorkAsExpected() {
        const result = this.sut.dir({name: this.DIR});
        assert.equal(result.name, TestUtils.qualifiedPath(this.DIR));
        assert.ok(typeof result.dispose === 'function');
        assert.ok(TestUtils.dirExists(result.name));
        result.dispose();
        assert.ok(!TestUtils.dirExists(TestUtils.qualifiedPath(this.DIR)));
    }

    @test
    public dirMustHandleNameErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
                throw new Error();
            }};
        try {
            this.sut.dir({name:this.DIR});
        } catch (err) {
            assert.ok(err instanceof Error);
        }
    }

    @test
    public dirMustHandleObjectCreationErrorsAsExpected() {
        (this.sut as any)._creator = { createDir: (configuration) => {
                throw new Error();
            }};
        try {
            this.sut.dir({name:this.DIR});
        } catch (err) {
            assert.ok(err instanceof Error);
        }
    }
}
