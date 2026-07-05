import { Entry } from "./types";
import { Language } from "./i18n";

const STORAGE_KEY = "balance-ledger-entries";
const LANGUAGE_KEY = "balance-ledger-language";

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: Entry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save entries", e);
  }
}

export function sortedEntries(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function exportEntries(entries: Entry[]): void {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "balance-ledger-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function loadLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(LANGUAGE_KEY);
    return (raw as Language) || "en";
  } catch {
    return "en";
  }
}

export function saveLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error("Failed to save language", e);
  }
}
