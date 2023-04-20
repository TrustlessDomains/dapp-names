import { isBrowser } from "@trustless-computer/dapp-core";

class LocalStorageUtil {

  set(key: string, data: unknown): void {
    if (!isBrowser()) {
      return;
    }

    const json = JSON.stringify(data);
    return localStorage.setItem(key, json);
  }

  get<T>(key: string): T | null {
    if (!isBrowser()) {
      return null;
    }

    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  }

  remove(key: string): void {
    if (!isBrowser()) {
      return;
    }

    return localStorage.removeItem(key);
  }
}

const instance = new LocalStorageUtil();

export default instance;
