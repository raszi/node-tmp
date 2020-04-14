

export default class StringUtils {

    public static isBlank(str: string): boolean {
        return str === null || typeof str === 'undefined' || !str.trim();
    }

    public static sort(strings: ArrayLike<string> | Set<string>) {
        const result = Array.from(strings);
        result.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        return result;
    }

    public static rsort(strings: ArrayLike<string> | Set<string>): string[] {
        const result = this.sort(strings);
        return result.reverse();
    }

    public static prefixesOnly(strings: ArrayLike<string> | Set<string>): string[] {
        const result: string[] = [];

        const input = this.sort(strings);

        let current: string = null;
        let idx: number = 0;
        do {
            const str: string = input[idx];
            if (current == null || !str.startsWith(current)) {
                current = str;
                result.push(current);
            }
        } while (++idx < input.length);

        return result;
    }

    public static matchesPrefix(str: string, prefixes: ArrayLike<string>): boolean {
        for (let idx = 0; idx < prefixes.length; idx++) {
            if (str.startsWith(prefixes[idx])) {
                return true;
            }
        }
        return false;
    }

    public static determinePrefix(str: string, prefixes: ArrayLike<string>): string {
        for (let idx = 0; idx < prefixes.length; idx++) {
            if (str.startsWith(prefixes[idx])) {
                return prefixes[idx];
            }
        }
        return str;
    }

    public static nameFromComponents(prefix: string, name: string, postfix?: string): string {
        const components = [
            prefix,
            process.pid,
            name
        ];
        if (!this.isBlank(postfix)) {
            components.push(postfix);
        }
        return components.join('-');
    }

    public static nameFromTemplate(pattern: RegExp, template: string, name: string): string {
        return template.replace(pattern, name);
    }
}
