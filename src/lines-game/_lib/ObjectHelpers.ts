/*eslint-disable */
export type Indexed<T = any> = {
    [key in string]: T;
};

function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function merge(lhs: Indexed, rhs: Indexed): any {
    Object.keys(rhs).forEach((key) => {
        if (!isObject(lhs[key]) && !isObject(rhs[key])) Object.assign(lhs, rhs);
        else if (isObject(rhs[key])) {
            if (isObject(lhs[key])) lhs[key] = merge(lhs[key], rhs[key]);
            else lhs[key] = rhs[key]; // make deep copy
        }
        else if (rhs[key] === null) lhs[key] = null
    });
    return lhs;
}

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
    if (typeof object !== 'object' || object === null) {
        return object;
    }

    const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
        [key]: acc,
    }), value as any);
    return merge(object as Indexed, result);
}


type PlainObject<T = unknown> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
        && value !== null
        && value.constructor === Object
        && Object.prototype.toString.call(value) === '[object Object]';
}

function isArrayOrObject(value: unknown): value is PlainObject {
    return isPlainObject(value) || Array.isArray(value);
}

export function isEqual(lhs: PlainObject, rhs: PlainObject) {
    // Сравнение количества ключей объектов и массивов
    if (lhs===null && rhs===null) {
        return true
    }

    if (
        (lhs===null && rhs!==null)
        || (lhs!==null && rhs===null)
        || (Object.keys(lhs).length !== Object.keys(rhs).length)
    ) {
        return false;
    }

    for (const [key, value] of Object.entries(lhs)) {
        const rightValue = rhs[key];
        if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            if (isEqual(value, rightValue)) {
                continue;
            }
            return false;
        }

        if (value !== rightValue) {
            return false;
        }
    }
    return true;
}

export function cloneDeep<T extends object = object>(obj: T) {
    return (function _cloneDeep(item: any): any | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
        // Handle:
        // * null
        // * undefined
        // * boolean
        // * number
        // * string
        // * symbol
        // * function
        if (item === null || typeof item !== 'object') {
            return item;
        }

        // Handle:
        // * Date
        if (item instanceof Date) {
            return new Date(item.valueOf());
        }

        // Handle:
        // * Array
        if (item instanceof Array) {
            const copy: any = [];

            item.forEach((_, i) => (copy[i] = _cloneDeep(item[i])));

            return copy;
        }

        // Handle:
        // * Set
        if (item instanceof Set) {
            const copy = new Set();

            item.forEach((v) => copy.add(_cloneDeep(v)));

            return copy;
        }

        // Handle:
        // * Map
        if (item instanceof Map) {
            const copy = new Map();

            item.forEach((v, k) => copy.set(k, _cloneDeep(v)));

            return copy;
        }

        // Handle:
        // * Object
        if (item instanceof Object) {
            const copy: any = {};

            // Handle:
            // * Object.symbol
            Object.getOwnPropertySymbols(item).forEach((s) => (copy[s] = _cloneDeep(item[s])));

            // Handle:
            // * Object.name (other)
            Object.keys(item).forEach((k) => (copy[k] = _cloneDeep(item[k])));

            return copy;
        }

        throw new Error(`Unable to copy object: ${item}`);
    }(obj));
}

export const objectFromPath = (path: string, value: unknown = ''): Indexed => {
    return path.split('.').reduceRight((acc, field) => ({[field]: acc}), value) || {}
}

export const exactEqual = (lhs: Indexed, rhs: Indexed, path: string): boolean => {
    const direction = path.split('.')
    let fromLhs = lhs
    let fromRhs = rhs

    for (const field of direction) {
        fromLhs = fromLhs[field]
        fromRhs = fromRhs[field]
    }

    if (!isArrayOrObject(fromLhs)) {
        return fromLhs === fromRhs
    }
    return isEqual(fromLhs, fromRhs)
}
