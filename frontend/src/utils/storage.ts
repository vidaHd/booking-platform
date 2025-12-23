export type StorageKey =
  | "user"
  | "token"
  | "language"
  | "theme"
  | "company"
  | "selectedCompany"
  | "service"
  | "userService"
  | "dashboardActiveTab"
  | "redirectAfterLogin";

export function getItem<T>(key: StorageKey, defaultValue: T | null = null): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // non-JSON string
      return raw as unknown as T;
    }
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: StorageKey, value: T): void {
  try {
    const toStore =
      typeof value === "string" ? (value as unknown as string) : JSON.stringify(value);
    localStorage.setItem(key, toStore);
  } catch {
    // ignore
  }
}

export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
