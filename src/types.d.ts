//
// // @deprecated
// // TODO:1.0.0 remove
// interface DeprecatedOptions {
//     unsafeCleanup?: boolean
// }
//
// export interface Options extends DeprecatedOptions {
//     name?: string;
//     prefix?: string;
//     postfix?: string;
//     dir?: string;
//     template?: string;
//     tries?: number;
//     keep?: boolean;
//     forceClean?: boolean;
//     mode?: number;
//     length?: number;
// }
//
// export type AsyncNamingCallback = (err: Error | null, name?: string) => void;
//
// export type DirOrFileCallback = (err: Error | null, name?: string, dispose?: DisposeCallback) => void;
//
// export type DisposeCallback = (next?: (err?: Error) => void) => void;
//
// // @deprecated
// // TODO:1.0.0 remove
// interface LegacySyncResult {
//     removeCallback: () => void;
// }
//
// export interface SyncResult extends LegacySyncResult {
//     name: string;
//     dispose: () => void;
// }
//
// export interface AsyncResult {
//     name: string;
//     dispose: () => Promise<void>;
// }
//
// export interface PromiseInterface {
//     readonly tmpdir: string;
//     forceClean(): void;
//     name(options?: Options): Promise<string>;
//     file(options?: Options): Promise<AsyncResult>;
//     dir(options?: Options): Promise<AsyncResult>;
// }
//
// export interface AsyncInterface {
//     readonly tmpdir: string;
//     forceClean(): void;
//     name(callback: AsyncNamingCallback, options?: Options): void;
//     file(callback: DirOrFileCallback, options?: Options): void;
//     dir(callback: DirOrFileCallback, options?: Options): void;
// }
//
// export interface SyncInterface {
//     readonly tmpdir: string;
//     forceClean(): void;
//     name(options?: Options): string;
//     file(options?: Options): SyncResult;
//     dir(options?: Options): SyncResult;
// }
