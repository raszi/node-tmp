interface Options {
    keep:boolean | null
    tries:number
    mode: number | null
    template: string | null
    name: string | null
    dir: string | null
    prefix: string | null
    postfix: string | null
    tmpdir: string | null
    unsafeCleanup: boolean | null
    detachDescriptor: boolean | null
    discardDescriptor: boolean | null
}

interface fileCallback {
    (
        err: Error | null,
        name: string,
        fd: number,
        fn: cleanupCallback
    ) : void
}

interface fileCallbackSync {
    (
        err: Error | null,
        name: string,
        fd: number,
        fn: cleanupCallbackSync
    ) : void
}


interface tmpNameCallback {
    (
        err: Error | null,
        name: string
    ) : void
}

interface dirCallback {
    (
        err: Error | null,
        name: string,
        fn: cleanupCallback
    ) : void
}

interface dirCallbackSync {
    (
        err: Error | null,
        name: string,
        fn: cleanupCallbackSync
    ) : void
}

interface cleanupCallback {
    (
        next?: simpleCallback
    ) : void
}

interface cleanupCallbackSync { () : void }

interface simpleCallback { () : void }


interface FileSyncObject {
    name: string
    fd: string
    removeCallback: fileCallback
}

interface DirSyncObject {
    name: string
    removeCallback: string
}

export function tmpName(options: Options|tmpNameCallback, callback: tmpNameCallback | undefined):tmpNameCallback | null
export function tmpNameSync(options: Object):string
export function file(options: Options|null|undefined|fileCallback, callback: undefined|fileCallback): void
export function fileSync(options: Options): FileSyncObject
export function dir(options: Options|dirCallback, callback: dirCallback | null): void
export function dirSync(options: Options):DirSyncObject
export function setGracefulCleanup(): void

export interface FileOptions {}
export interface DirOptions {}
export interface TmpNameOptions {} 
