
import * as tmp from '../src';

import AsyncInterfaceImpl from '../src/internal/AsyncInterfaceImpl';
import PromiseInterfaceImpl from '../src/internal/PromiseInterfaceImpl';
import SyncInterfaceImpl from '../src/internal/SyncInterfaceImpl';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class TmpInterfaceTestSuite {

    @test
    public asyncInterfaceMustExist() {
        assert.ok(tmp.async instanceof AsyncInterfaceImpl);
    }

    @test
    public syncInterfaceMustExist() {
        assert.ok(tmp.sync instanceof SyncInterfaceImpl);
    }

    @test
    public promiseInterfaceMustExist() {
        assert.ok(tmp.promise instanceof PromiseInterfaceImpl);
    }
}
