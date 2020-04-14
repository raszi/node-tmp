import AsyncObjectCreator from '../../src/internal/AsyncObjectCreator';
import GarbageCollector from '../../src/internal/GarbageCollector';

import TestUtils from '../TestUtils';

import * as fs from 'fs';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class AsyncObjectCreatorTestSuite {

    private readonly DIR: string = 'async_object_dir';
    private readonly FILE: string = 'async_object_file';

    private sut: AsyncObjectCreator = new AsyncObjectCreator();

    public before() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    public after() {
        TestUtils.discardTempFile(this.FILE);
        TestUtils.discardTempDir(this.DIR);
    }

    @test
    public createFileMustReturnExpectedResult(done) {
        const oconfiguration = TestUtils.fileConfiguration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            try {
                assert.equal(result.name, oname);
                assert.ok(TestUtils.fileExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils.fileExists(result.name));
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
        const oconfiguration = TestUtils.fileConfiguration({ name: this.FILE });
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
        const oconfiguration = TestUtils.fileConfiguration({ name: this.FILE });
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
        const oconfiguration = TestUtils.fileConfiguration({ name: this.FILE });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createFile(oname, oconfiguration, (err, result) => {
            try {
                TestUtils.discardTempFile(result.name);
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
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                assert.equal(result.name, oname);
                assert.ok(TestUtils.dirExists(result.name));
                assert.ok(typeof result.dispose === 'function');
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils.dirExists(result.name));
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
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR });
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
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils.qualifiedSubPath('file', result.name);
                TestUtils.createTempFile(fname);
                GarbageCollector.INSTANCE.forceClean = true;
                return result.dispose(() => {
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils.fileExists(fname));
                        assert.ok(!TestUtils.dirExists(result.name));
                        return done();
                    } catch (err) {
                        return done(err);
                    } finally {
                        GarbageCollector.INSTANCE.forceClean = false;
                    }
                });
            } catch (err) {
                return done(err);
            } finally {
                GarbageCollector.INSTANCE.forceClean = false;
            }
        });
    }

    @test
    public createDirDisposeMustForceCleanOnConfigurationSetting(done) {
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR, forceClean: true });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils.qualifiedSubPath('file', result.name);
                TestUtils.createTempFile(fname);
                return result.dispose((err) => {
                    try {
                        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject(result.name));
                        assert.ok(!TestUtils.fileExists(fname));
                        assert.ok(!TestUtils.dirExists(result.name));
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
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                TestUtils.discardTempDir(result.name);
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
        const oconfiguration = TestUtils.dirConfiguration({ name: this.DIR });
        const oname = TestUtils.qualifiedPath(oconfiguration.name);
        this.sut.createDir(oname, oconfiguration, (err, result) => {
            try {
                const fname = TestUtils.qualifiedSubPath(this.FILE, result.name);
                TestUtils.createTempFile(fname);
                return result.dispose((err? : Error) => {
                    try {
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
