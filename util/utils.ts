export function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

export function mergeDeep(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export class PathNotFoundError extends Error {
    constructor(path: string) {
        super(`Path not found: ${path}`);
    }
}

export function resolvePath(obj: any, path: string) {
    const keys = path.split('.');
    let value = obj;
    for (let key of keys) {
        if (!value.hasOwnProperty(key)) {
            throw new PathNotFoundError(path);
        }

        value = value[key];
        if (value === undefined) {
            break;
        }
    }
    return value;
}

export function resolvePlaceholders(obj: any, root: any = obj) {
    for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            resolvePlaceholders(obj[key], root);
            continue;
        }

        if (typeof obj[key] !== "string") {
            continue;
        }

        obj[key] = resolvePlaceholderString(obj, obj[key], root);
    }
}

export function resolvePlaceholderString(obj: any, value: string, root: any = obj): string {
    const matches = value.match(/\${(.*?)}/g);

    if (!matches) {
        return value;
    }

    matches.forEach((match: string) => {
        const placeholder = match.substring(2, match.length - 1);

        let placeholderValue = "${" + placeholder + "}";
        try {
            placeholderValue = resolvePath(root, placeholder);
        } catch (e: any) {
            if (e instanceof PathNotFoundError) {
                console.debug(e.message);
            }
            else {
                const message = `Encountered error while resolving placeholder ${placeholder}: ${e.message}`;
                console.error(message);
                throw new RangeError(message);
            }
            return;
        }

        value = value.replace(match, resolvePlaceholderString(obj, placeholderValue, root));
    });

    return value;
}