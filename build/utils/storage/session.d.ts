export declare const sessionStg: {
    set: <K extends "sessionStorage">(key: K, value: WindowSessionStorage[K]) => void;
    get: <K extends "sessionStorage">(key: K) => WindowSessionStorage[K];
    remove: (key: "sessionStorage") => void;
    clear: () => void;
};
