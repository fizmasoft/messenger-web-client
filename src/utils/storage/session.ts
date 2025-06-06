import { decrypt, encrypt } from '../crypto';

function createSessionStorage<T extends WindowSessionStorage = WindowSessionStorage>() {
  function set<K extends keyof T>(key: K, value: T[K]) {
    sessionStorage.setItem(key as string, encrypt(value));
  }

  function get<K extends keyof T>(key: K) {
    const json = sessionStorage.getItem(key as string);
    let data: T[K] | null = null;
    if (json) {
      try {
        data = decrypt(json);
      } catch {
        // Prevent parsing failure
      }
    }
    return data;
  }

  function remove(key: keyof T) {
    window.sessionStorage.removeItem(key as string);
  }

  function clear() {
    window.sessionStorage.clear();
  }

  return {
    set,
    get,
    remove,
    clear,
  };
}

export const sessionStg = createSessionStorage();
