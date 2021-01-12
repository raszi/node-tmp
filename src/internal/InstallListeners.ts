import GarbageCollector from './GarbageCollector';

let guard: boolean;

/**
 * Process exit listener.
 *
 * This gets installed by default in order to make sure that all remaining garbage will be removed on process exit.
 *
 * Note that if a process keeps an active lock on any of the temporary objects created by tmp, then these objects
 * will remain in place and cannot be removed.
 *
 * Note also, that for all file and directory objects that have been configured for {@link Options#keep}ing but which
 * are children of a temporary directory that can be removed by tmp, especially when the {@link Options#forceClean}
 * option has been set, then these objects will be removed as well.
 *
 * In order to clean up on SIGINT, e.g. CTRL-C, you will have to install a handler yourself, see the below example.
 *
 * @example
 * process.on('SIGINT', process.exit);
 *
 * @function exit_listener
 * @protected
 *
 * @category Installed Listeners
 */
if (!guard) {
    process.on('exit', function () {
        GarbageCollector.INSTANCE.dispose();
    });
    guard = true;
}
