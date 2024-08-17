export declare const sessionStg: {
    set: <K extends "themeColor">(key: K, value: StorageInterface.Session[K]) => void;
    get: <K extends "themeColor">(key: K) => StorageInterface.Session[K];
    remove: (key: "themeColor") => void;
    clear: () => void;
};
