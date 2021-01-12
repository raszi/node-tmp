export function isBlank(str: string): boolean {
    return str === null || typeof str === 'undefined' || !str.trim();
}

export function sort(strings: ArrayLike<string> | Set<string>) {
    const result = Array.from(strings);
    result.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    return result;
}

export function rsort(strings: ArrayLike<string> | Set<string>): string[] {
    const result = sort(strings);
    return result.reverse();
}

export function prefixesOnly(strings: ArrayLike<string> | Set<string>): string[] {
    const result: string[] = [];

    const input = sort(strings);

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

export function matchesPrefix(str: string, prefixes: ArrayLike<string>): boolean {
    for (let idx = 0; idx < prefixes.length; idx++) {
        if (str.startsWith(prefixes[idx])) {
            return true;
        }
    }
    return false;
}

export function determinePrefix(str: string, prefixes: ArrayLike<string>): string {
    for (let idx = 0; idx < prefixes.length; idx++) {
        if (str.startsWith(prefixes[idx])) {
            return prefixes[idx];
        }
    }
    return str;
}

export function nameFromComponents(prefix: string, name: string, postfix?: string): string {
    const components = [
        prefix,
        process.pid,
        name
    ];
    if (!isBlank(postfix)) {
        components.push(postfix);
    }
    return components.join('-');
}

export function nameFromTemplate(pattern: RegExp, template: string, name: string): string {
    return template.replace(pattern, name);
}
