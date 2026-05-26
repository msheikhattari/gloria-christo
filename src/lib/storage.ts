// Browser-local storage of user prefs + API key. Never sent to any server
// other than the model provider's API. Per principle: bring-your-own-key.

export type Provider = "anthropic";
export type Model =
  | "claude-opus-4-7"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5";

export interface Settings {
  apiKey: string;
  provider: Provider;
  model: Model;
}

const KEY = "gloria-christo:settings";

const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  provider: "anthropic",
  model: "claude-sonnet-4-6",
};

export function loadSettings(): Settings {
  if (typeof localStorage === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function hasKey(): boolean {
  return loadSettings().apiKey.trim().length > 0;
}

export function clearSettings(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}
