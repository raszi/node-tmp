import {
    default as tmpAsync,
    dir as asyncDir,
    file as asyncFile,
    forceClean as asyncForceClean
} from '../src/async';
import {
    default as tmpPromise,
    dir as promiseDir,
    file as promiseFile,
    forceClean as promiseForceClean
} from '../src/promise';
import {
    default as tmpSync,
    dir as syncDir,
    file as syncFile,
    forceClean as syncForceClean
} from '../src/sync';

import AsyncInterfaceImpl from '../src/internal/AsyncInterfaceImpl';
import PromiseInterfaceImpl from '../src/internal/PromiseInterfaceImpl';
import SyncInterfaceImpl from '../src/internal/SyncInterfaceImpl';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class TmpInterfaceTestSuite {

    @test
    public asyncInterfaceMustExist() {
        assert.ok(tmpAsync instanceof AsyncInterfaceImpl);
    }

    @test
    public syncInterfaceMustExist() {
        assert.ok(tmpSync instanceof SyncInterfaceImpl);
    }

    @test
    public promiseInterfaceMustExist() {
        assert.ok(tmpPromise instanceof PromiseInterfaceImpl);
    }
}
