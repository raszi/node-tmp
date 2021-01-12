import AsyncObjectCreator from '../../src/internal/AsyncObjectCreator';
import Configuration from '../../src/internal/Configuration';
import GarbageCollector from '../../src/internal/GarbageCollector';

import * as TestUtils from '../TestUtils';

import * as fs from 'fs';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class AsyncObjectCreatorTestSuite {

    private readonly DIR: string = 'async_object_dir';
    private readonly FILE: string = 'async_object_file';

    private sut: AsyncObjectCreator;

    public before() {
        this.sut = new AsyncObjectCreator();
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
        GarbageCollector.INSTANCE.forceClean = false;
    }

    public after() {
        TestUtils.discard(this.FILE);
        TestUtils.discard(this.DIR);
        GarbageCollector.INSTANCE.forceClean = false;
    }

    @test
    public createFileMustReturnExpectedResult(done) {
        const oconfiguration = new Configuration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.strictEqual(result.name, oname);
                assert.ok(TestUtils.fileExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose((err) => {
                    if (err) { return done(err); }
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils.notExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createFileMustHandleErrorOnOpen(done) {
        const fsopenfn = fs.open;
        (fs as any).open = function (name, flags, mode, cb) { return cb(new Error()); };
        const oconfiguration = new Configuration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            } finally {
                (fs as any).open = fsopenfn;
            }
        });
    }

    @test
    public createFileMustHandleErrorOnClose(done) {
        const fsclosefn = fs.close;
        (fs as any).close = function (fd, cb) {
            return fsclosefn(fd, function () { cb(new Error()); });
        };
        const oconfiguration = new Configuration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            } finally {
                (fs as any).close = fsclosefn;
            }
        });
    }

    @test
    public createFileDisposeMustNotTryToUnlinkNonExistingObject(done) {
        const oconfiguration = new Configuration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                TestUtils.discard(result.name);
                return result.dispose((err) => {
                    assert.ok(!err);
                    assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                    return done();
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createDirMustReturnExpectedResult(done) {
        const oconfiguration = new Configuration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.strictEqual(result.name, oname);
                assert.ok(TestUtils.dirExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose((err) => {
                    if (err) { return done(err); }
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils.notExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createDirMustHandleErrorOnMkdir(done) {
        const fsmkdirfn = fs.mkdir;
        (fs as any).mkdir = function (name, mode, cb) { return cb(new Error()); };
        const oconfiguration = new Configuration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err) => {
            try {
                assert.ok(err instanceof Error);
                return done();
            } catch (err) {
                return done(err);
            } finally {
                (fs as any).mkdir = fsmkdirfn;
            }
        });
    }

    @test
    public createDirDisposeMustForceCleanOnGlobalSetting(done) {
        const oconfiguration = new Configuration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.ok(TestUtils.dirExists(result.name));
                const fname = TestUtils.qualifiedSubPath('file', result.name);
                TestUtils.createTempFile(fname);
                GarbageCollector.INSTANCE.forceClean = true;
                return result.dispose((err) => {
                    if (err) { return done(err); }
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils.notExists(fname));
                        assert.ok(TestUtils.notExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createDirDisposeMustForceCleanOnConfigurationSetting(done) {
        const oconfiguration = new Configuration({ name: this.DIR, forceClean: true });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.ok(TestUtils.dirExists(result.name));
                const fname = TestUtils.qualifiedSubPath('file', result.name);
                TestUtils.createTempFile(fname);
                return result.dispose((err) => {
                    if (err) { return done(err); }
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils.notExists(fname));
                        assert.ok(TestUtils.notExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createDirDisposeMustNotTryToUnlinkNonExistingObject(done) {
        const oconfiguration = new Configuration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.ok(TestUtils.dirExists(result.name));
                TestUtils.discard(result.name);
                return result.dispose((err) => {
                    try {
                        assert.ok(!err);
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }

    @test
    public createDirDisposeMustFailOnNonEmptyDir(done) {
        const oconfiguration = new Configuration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            if (err) { return done(err); }
            try {
                assert.ok(TestUtils.dirExists(result.name));
                const fname = TestUtils.qualifiedSubPath(this.FILE, result.name);
                TestUtils.createTempFile(fname);
                return result.dispose((err) => {
                    try {
                        // assert.ok(err instanceof Error); // is not an instance of Error?
                        assert.ok(err.toString().indexOf('ENOTEMPTY') !== -1);
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(TestUtils.fileExists(fname));
                        assert.ok(TestUtils.dirExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    }
                });
            } catch (err) {
                return done(err);
            }
        });
    }
}
