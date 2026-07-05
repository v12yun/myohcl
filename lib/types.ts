export type Entry = {
  id: string;
  date: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  memo?: string;
};

export type EntryDraft = {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  memo: string;
};
