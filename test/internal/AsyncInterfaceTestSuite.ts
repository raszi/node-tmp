import {AsyncInterface} from '../../src';

import AsyncInterfaceImpl from '../../src/internal/AsyncInterfaceImpl';

import TestUtils from '../TestUtils';
import AbstractInterfaceTestSuiteBase from './AbstractInterfaceTestSuiteBase';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class AsyncInterfaceTestSuite extends AbstractInterfaceTestSuiteBase<AsyncInterface> {

    private readonly DIR: string = 'async_iface_dir';
    private readonly FILE: string = 'async_iface_file';

    before() {
        this.sut = new AsyncInterfaceImpl();
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    public after() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    @test
    public nameMustWorkAsExpected(done) {
        this.sut.name((err, name) => {
            if (err) { return done(err); }
            try {
                assert.equal(name, TestUtils.qualifiedPath(this.FILE));
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.FILE});
    }

    @test
    public nameMustHandleErrorsAsExpected(done) {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
            throw new Error();
        }};
        this.sut.name((err, name) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.FILE});
    }

    @test
    public fileMustWorkAsExpected(done) {
        this.sut.file((err, result) => {
            if (err) { return done(err); }
            try {
                assert.equal(result.name, TestUtils.qualifiedPath(this.FILE));
                assert.ok(TestUtils.fileExists(result.name));
                // TODO: assert is file
                assert.ok(typeof result.dispose === 'function');
                result.dispose();
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name: this.FILE});
    }

    @test
    public fileMustHandleNameErrorsAsExpected(done) {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
                throw new Error();
            }};
        this.sut.file((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.FILE});
    }

    @test
    public fileMustHandleObjectCreationErrorsAsExpected(done) {
        (this.sut as any)._creator = { createFile: (name, configuration, cb) => {
                return cb(new Error());
            }};
        this.sut.file((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.FILE});
    }

    @test
    public dirMustWorkAsExpected(done) {
        this.sut.dir((err, result) => {
            if (err) { return done(err); }
            try {
                assert.equal(result.name, TestUtils.qualifiedPath(this.DIR));
                assert.ok(TestUtils.dirExists(result.name));
                // TODO: assert is dir
                assert.ok(typeof result.dispose === 'function');
                result.dispose();
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.DIR});
    }

    @test
    public dirMustHandleNameErrorsAsExpected(done) {
        (this.sut as any)._nameGenerator = { generate: (configuration) => {
                throw new Error();
            }};
        this.sut.dir((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.DIR});
    }

    @test
    public dirMustHandleObjectCreationErrorsAsExpected(done) {
        (this.sut as any)._creator = { createDir: (name, configuration, cb) => {
                return cb(new Error());
            }};
        this.sut.dir((err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            }
        }, {name:this.DIR});
    }
}
