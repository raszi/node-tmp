import Configuration from '../../src/internal/Configuration';
import GarbageCollector from '../../src/internal/GarbageCollector';

import {suite, test} from '@testdeck/jest';
import * as assert from 'assert';

@suite
class GarbageCollectorTestSuite {

    @test
    public INSTANCE() {
        assert.ok(GarbageCollector.INSTANCE instanceof GarbageCollector);
    }

    @test
    public registerDir() {
        GarbageCollector.INSTANCE.registerDir('dir', new Configuration());
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject('dir'));
        GarbageCollector.INSTANCE.unregisterObject('dir');
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject('dir'));
    }

    @test
    public registerFile() {
        GarbageCollector.INSTANCE.registerDir('dir', new Configuration());
        GarbageCollector.INSTANCE.registerFile('file', new Configuration());
        GarbageCollector.INSTANCE.registerFile('dir/file', new Configuration());
        GarbageCollector.INSTANCE.registerFile('dir/file2', new Configuration());
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject('dir'));
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject('file'));
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject('dir/file'));
        assert.ok(GarbageCollector.INSTANCE.isRegisteredObject('dir/file2'));
        GarbageCollector.INSTANCE.unregisterObject('dir/file2');
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject('dir/file2'));
        GarbageCollector.INSTANCE.unregisterObject('dir');
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject('dir/file'));
        GarbageCollector.INSTANCE.unregisterObject('file');
        assert.ok(!GarbageCollector.INSTANCE.isRegisteredObject('file'));
    }

    @test
    public dispose() {
        // TODO: use chai instead
        const watches = {
            reset: false,
            prune: false,
            dirGarbageSet: false,
            fileGarbageSet: false,
            prunedDirGarbageGet: false,
            prunedFileGarbageGet: false
        };
        const origPruner = (GarbageCollector.INSTANCE as any)._pruner;
        (GarbageCollector.INSTANCE as any)._pruner = {
            set dirGarbage(value) { watches.dirGarbageSet = true; },
            set fileGarbage(value) { watches.fileGarbageSet = true; },
            get prunedDirGarbage() { watches.prunedDirGarbageGet = true; return []; },
            get prunedFileGarbage() { watches.prunedFileGarbageGet = true; return []; },
            prune() { watches.prune = true; },
            reset() { watches.reset = true; }
        };
        const origDisposer = (GarbageCollector.INSTANCE as any)._disposer;
        (GarbageCollector.INSTANCE as any)._disposer = {
            disposeDirGarbage(dirGarbage) {},
            disposeFileGarbage(fileGarbage) {},
        };
        try {
            GarbageCollector.INSTANCE.dispose();
            assert.ok(watches.reset);
            assert.ok(watches.prune);
            assert.ok(watches.dirGarbageSet);
            assert.ok(watches.fileGarbageSet);
            assert.ok(watches.prunedDirGarbageGet);
            assert.ok(watches.prunedFileGarbageGet);
        } finally {
            (GarbageCollector.INSTANCE as any)._pruner = origPruner;
            (GarbageCollector.INSTANCE as any)._disposer = origDisposer;
        }
    }

    @test
    public forceClean() {
        GarbageCollector.INSTANCE.forceClean = true;
        assert.ok(GarbageCollector.INSTANCE.forceClean);
        GarbageCollector.INSTANCE.forceClean = false;
        assert.ok(!GarbageCollector.INSTANCE.forceClean);
    }
}
