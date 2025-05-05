import type { ILocalStorage } from '../../types/storage';
export declare const localStg: {
    set: <K extends keyof ILocalStorage>(key: K, value: ILocalStorage[K], expire?: number | null) => void;
    get: <K extends keyof ILocalStorage>(key: K) => ILocalStorage[K];
    remove: (key: keyof ILocalStorage) => void;
    clear: () => void;
};
