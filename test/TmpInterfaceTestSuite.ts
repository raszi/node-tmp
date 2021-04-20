import {
    default as asyncTmp,
    dir as asyncDir,
    file as asyncFile,
    forceClean as asyncForceClean,
    name as asyncName

} from '../src/async';
import {
    default as promiseTmp,
    dir as promiseDir,
    file as promiseFile,
    forceClean as promiseForceClean,
    name as promiseName
} from '../src/promise';
import {
    default as syncTmp,
    dir as syncDir,
    file as syncFile,
    forceClean as syncForceClean,
    name as syncName,
} from '../src/sync';

import AsyncInterfaceImpl from '../src/internal/AsyncInterfaceImpl';
import PromiseInterfaceImpl from '../src/internal/PromiseInterfaceImpl';
import SyncInterfaceImpl from '../src/internal/SyncInterfaceImpl';

import {params, suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class TmpInterfaceTestSuite {

    @test
    public asyncInterfaceMustExist() {
        assert.ok(asyncTmp instanceof AsyncInterfaceImpl);
    }

    @test
    @params(['dir', asyncDir], 'dir')
    @params(['file', asyncFile], 'file')
    @params(['name', asyncName], 'name')
    @params(['forceClean', asyncForceClean], 'forceClean')
    public asyncFnsMustDelegateToAsyncTmp(params) {
        this.runDelegationTest(asyncTmp, params[0], params[1]);
    }

    @test
    public syncInterfaceMustExist() {
        assert.ok(syncTmp instanceof SyncInterfaceImpl);
    }

    @test
    @params(['dir', syncDir], 'dir')
    @params(['file', syncFile], 'file')
    @params(['name', syncName], 'name')
    @params(['forceClean', syncForceClean], 'forceClean')
    public syncFnsMustDelegateToSyncTmp(params) {
        this.runDelegationTest(syncTmp, params[0], params[1]);
    }

    @test
    public promiseInterfaceMustExist() {
        assert.ok(promiseTmp instanceof PromiseInterfaceImpl);
    }

    @test
    public promiseDirMustExist() {
        assert.ok(typeof promiseDir === 'function');
    }

    @test
    @params(['dir', promiseDir], 'dir')
    @params(['file', promiseFile], 'file')
    @params(['name', promiseName], 'name')
    @params(['forceClean', promiseForceClean], 'forceClean')
    public promiseFnsMustDelegateToPromiseTmp(params) {
        this.runDelegationTest(promiseTmp, params[0], params[1]);
    }

    private runDelegationTest(iface, name, fn) {
        let called = false;
        const tester = () => {
            called = true;
        };
        const oldfn = iface[name];
        iface[name] = tester;
        try {
            try {
                fn();
            }
            finally {
                assert.ok(called);
            }
        } finally {
            iface[name] = oldfn;
        }
    }
}
