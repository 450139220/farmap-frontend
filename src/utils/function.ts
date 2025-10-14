function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timer: number | undefined;

    return function (...args: Parameters<T>): void {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

function deepCopy<T>(obj: T, wm = new WeakMap()): T {
    if (typeof obj !== "object" || obj === null) return obj;
    if (wm.has(obj)) return wm.get(obj);

    const newObj: any = Array.isArray(obj) ? [] : {};
    wm.set(obj, newObj);

    for (const key in obj) {
        newObj[key] = deepCopy((obj as any)[key], wm);
    }

    return newObj;
}

export { debounce, deepCopy };
