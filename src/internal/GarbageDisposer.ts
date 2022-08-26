
import * as fs from 'fs';
import rimraf = require('rimraf');
import {DirGarbage, Garbage} from './GarbageCollector';

export default class GarbageDisposer {

  public disposeDirGarbage(garbage: DirGarbage[]): void {
    garbage.forEach((garbage) => {
      try { rimraf.sync(garbage.name); } catch (_) {}
    });
  }

  public disposeFileGarbage(garbage: Garbage[]): void {
    garbage.forEach((garbage) => {
      try { fs.unlinkSync(garbage.name); } catch (_) {}
    });
  }
}