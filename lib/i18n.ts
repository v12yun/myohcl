export type Language = "en" | "ja";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Buttons & Actions
    "btn.list": "List",
    "btn.export": "Export backup",
    "btn.addEntry": "Add entry",
    "btn.settings": "Settings",
    "btn.cancel": "Cancel",
    "btn.delete": "Delete",

    // Titles & Headers
    "title.entries": "Entries",
    "title.addEntry": "Add a daily entry",
    "title.settings": "Settings",

    // Labels
    "label.date": "Date",
    "label.open": "Open (balance)",
    "label.close": "Close (balance)",
    "label.high": "High (balance)",
    "label.low": "Low (balance)",
    "label.memo": "Memo (optional)",
    "label.language": "Language",

    // Hints & Messages
    "hint.firstEntry":
      "For the first entry, enter your starting balance as the 'Open' value.",
    "hint.openValue":
      "The Open value is auto-filled with the previous day's Close. You can edit it.",

    // Empty States
    "empty.noEntries": "No entries yet",
    "empty.noEntriesDesc":
      'Please use the "+ Add entry" button below to enter the first day\'s open, high, low, and close.',
    "empty.noRecordsToExport": "No records to export.",

    // Errors
    "error.fillRequired": "Please fill in all required fields.",
    "error.highLowRange":
      "High must be >= open/close and Low must be <= open/close.",
    "error.dateExists":
      "An entry for this date already exists. Delete it from the list before adding again.",

    // Delete Confirmation
    "confirm.deleteEntry": "Delete this entry?",

    // Chart Tooltip
    "chart.pnl": "P/L",

    // Stats
    "stats.days": "Days",
    "stats.daysValue": "days",
    "stats.winRate": "Win rate",
    "stats.winsLosses": "Wins/Losses",
    "stats.bestDay": "Best day",
    "stats.worstDay": "Worst day",
    "stats.maxDD": "Max DD",

    // Placeholders
    "placeholder.memo": "e.g. USD/JPY scalping",
  },
  ja: {
    // Buttons & Actions
    "btn.list": "一覧",
    "btn.export": "バックアップを書き出す",
    "btn.addEntry": "記録を追加",
    "btn.settings": "設定",
    "btn.cancel": "キャンセル",
    "btn.delete": "削除する",

    // Titles & Headers
    "title.entries": "記録一覧",
    "title.addEntry": "1日分の記録を追加",
    "title.settings": "設定",

    // Labels
    "label.date": "日付",
    "label.open": "始値（残高）",
    "label.close": "終値（残高）",
    "label.high": "高値（残高）",
    "label.low": "安値（残高）",
    "label.memo": "メモ（任意）",
    "label.language": "言語",

    // Hints & Messages
    "hint.firstEntry": "最初の記録は「始値」に開始時点の残高を入力してください。",
    "hint.openValue": "始値は前日の終値を自動で入力しています。修正も可能です。",

    // Empty States
    "empty.noEntries": "まだ記録がありません",
    "empty.noEntriesDesc":
      "下の「＋ 記録を追加」から最初の1日の始値・高値・安値・終値を入力してください",
    "empty.noRecordsToExport": "書き出す記録がありません。",

    // Errors
    "error.fillRequired": "すべての必須項目を入力してください。",
    "error.highLowRange": "高値は始値・終値以上、安値は始値・終値以下である必要があります。",
    "error.dateExists":
      "その日付の記録は既に存在します。一覧から削除してから登録し直してください。",

    // Delete Confirmation
    "confirm.deleteEntry": "この記録を削除しますか？",

    // Chart Tooltip
    "chart.pnl": "損益",

    // Stats
    "stats.days": "記録日数",
    "stats.daysValue": "日",
    "stats.winRate": "勝率",
    "stats.winsLosses": "勝ち/負け",
    "stats.bestDay": "最高益日",
    "stats.worstDay": "最大損失日",
    "stats.maxDD": "最大DD",

    // Placeholders
    "placeholder.memo": "ドル円 スキャルピング",
  },
};

export const getLabel = (key: string, lang: Language): string => {
  return translations[lang][key] || key;
};

// Format currency based on language
const currencyFormatters: Record<Language, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }),
  ja: new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }),
};

export const fmtCurrency = (n: number, lang: Language): string => {
  return currencyFormatters[lang].format(Math.round(n));
};

export const fmtCurrencySigned = (n: number, lang: Language): string => {
  const sign = n >= 0 ? "+" : "";
  return sign + fmtCurrency(n, lang);
};
