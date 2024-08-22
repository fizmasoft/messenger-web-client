import { ENV } from '../../common/config';
import { ILocalStorage } from '../../types/storage';
import { decrypt, encrypt } from '../crypto';

interface StorageData<T> {
  value: T;
  expire: number | null;
}

let localStorage: {
  setItem: (key: string, value: string) => void;
  getItem: (key: string) => string;
  removeItem: (key: string) => void;
  clear: () => void;
};
if (ENV.isBrowser) {
  localStorage = window.localStorage;
} else {
  const map = new Map();
  localStorage = {
    clear() {
      map.clear();
      return map;
    },
    getItem(key) {
      return map.get(key);
    },
    removeItem(key) {
      map.delete(key);
      return map;
    },
    setItem(key, value) {
      map.set(key, value);
      return map;
    },
  };
}

function createLocalStorage<T extends ILocalStorage = ILocalStorage>() {
  /** The default cache period is 7 days */
  const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

  function set<K extends keyof T>(key: K, value: T[K], expire: number | null = DEFAULT_CACHE_TIME) {
    const storageData: StorageData<T[K]> = {
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
    };

    localStorage.setItem(key as string, encrypt(storageData));
  }

  function get<K extends keyof T>(key: K) {
    const json = localStorage.getItem(key as string);
    if (!json) {
      return null;
    }

    let storageData: StorageData<T[K]> | null = null;
    try {
      storageData = decrypt(json);
    } catch {
      // Prevent parsing failure
    }
    if (!storageData) {
      remove(key);
      return null;
    }

    const { value, expire } = storageData;
    // Return directly within the validity period
    if (!(expire === null || expire >= Date.now())) {
      return null;
    }

    return value;
  }

  function remove(key: keyof T) {
    localStorage.removeItem(key as string);
  }

  function clear() {
    localStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}

export const localStg = createLocalStorage<ILocalStorage>();
