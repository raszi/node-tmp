import {PromiseInterface} from '../../src/types';

import PromiseInterfaceImpl from '../../src/internal/PromiseInterfaceImpl';

import * as TestUtils from '../TestUtils';
import AbstractInterfaceTestSuiteBase from './AbstractInterfaceTestSuiteBase';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class PromiseInterfaceTestSuite extends AbstractInterfaceTestSuiteBase<PromiseInterface> {

    private readonly DIR: string = 'promise_iface_dir';
    private readonly FILE: string = 'promise_iface_file';

    public before() {
        this.sut = new PromiseInterfaceImpl();
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
    }

    public after() {
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
    }

    @test
    public async nameMustWorkAsExpected() {
        return this.sut.name({name:this.FILE})
            .then((name) => {
                assert.strictEqual(name, TestUtils.qualifiedPath(this.FILE));
            });
    }

    @test
    public async nameMustHandleErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => { throw new Error(); }};
        let caught = false;
        return this.sut.name({name:this.FILE})
            .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
            .finally(() => {
                assert.ok(caught);
            });
    }

    @test
    public async fileMustWorkAsExpected() {
        return this.sut.file({name:this.FILE})
            .then((result) => {
                assert.strictEqual(result.name, TestUtils.qualifiedPath(this.FILE));
                assert.ok(typeof result.dispose === 'function');
                assert.ok(TestUtils.fileExists(result.name));
                return result.dispose();
            })
            .then(() => {
                assert.ok(TestUtils.notExists(TestUtils.qualifiedPath(this.FILE)));
            });
    }

    @test
    public async fileMustHandleNameErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => { throw new Error(); }};
        let caught = false;
        return this.sut.file({name:this.FILE})
            .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
            .finally(() => {
                assert.ok(caught);
            });
    }

    @test
    public async fileMustHandleObjectCreationErrorsAsExpected() {
        (this.sut as any)._creator = { createFile: (configuration) => { return Promise.reject(new Error()); }};
        let caught = false;
        return this.sut.file({name:this.FILE})
            .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
            .finally(() => {
                assert.ok(caught);
            });
    }

    @test
    public async dirMustWorkAsExpected() {
        return this.sut.dir({name:this.DIR})
            .then((result) => {
                assert.strictEqual(result.name, TestUtils.qualifiedPath(this.DIR));
                assert.ok(typeof result.dispose === 'function');
                assert.ok(TestUtils.dirExists(result.name));
                return result.dispose();
            })
            .then(() => {
                assert.ok(TestUtils.notExists(TestUtils.qualifiedPath(this.DIR)));
            });
    }

    @test
    public async dirMustHandleNameErrorsAsExpected() {
        (this.sut as any)._nameGenerator = { generate: (configuration) => { throw new Error(); }};
        let caught = false;
        return this.sut.dir({name:this.DIR})
            .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
            .finally(() => {
                assert.ok(caught);
            });
    }

    @test
    public async dirMustHandleObjectCreationErrorsAsExpected() {
        (this.sut as any)._creator = { createDir: (configuration) => { return Promise.reject(new Error()); }};
        let caught = false;
        return this.sut.dir({name:this.DIR})
            .catch((err) => {
                assert.ok(err instanceof Error);
                caught = true;
            })
            .finally(() => {
                assert.ok(caught);
            });
    }
}
