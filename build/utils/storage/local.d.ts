export declare const localStg: {
    set: <K extends keyof StorageInterface.ILocal>(key: K, value: StorageInterface.ILocal[K], expire?: number | null) => void;
    get: <K extends keyof StorageInterface.ILocal>(key: K) => StorageInterface.ILocal[K];
    remove: (key: keyof StorageInterface.ILocal) => void;
    clear: () => void;
};
