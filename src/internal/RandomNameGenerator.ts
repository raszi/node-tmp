import * as crypto from 'crypto';

/**
 * Random name generator based on crypto.
 * Adapted from http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript
 */
export default class RandomNameGenerator {

    public static readonly POOL: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    public static readonly POOL_LENGTH: number = RandomNameGenerator.POOL.length;

    public generate(length: number): string {

        let result: string = '';

        // make sure that we do not fail because we ran out of entropy
        let rnd = null;
        try {
            rnd = crypto.randomBytes(length);
        } catch (_) {
            rnd = crypto.pseudoRandomBytes(length);
        }

        for (let idx = 0; idx < length; idx++) {
            result += RandomNameGenerator.POOL[rnd[idx] % RandomNameGenerator.POOL_LENGTH];
        }

        return result;
    }
}