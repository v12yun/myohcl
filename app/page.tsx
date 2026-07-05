"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import StatsStrip from "@/components/StatsStrip";
import AssetChart from "@/components/AssetChart";
import BottomBar from "@/components/BottomBar";
import EntrySheet from "@/components/EntrySheet";
import LogSheet from "@/components/LogSheet";
import SettingsSheet from "@/components/SettingsSheet";
import { Entry } from "@/lib/types";
import { loadEntries, saveEntries, exportEntries } from "@/lib/storage";
import { useLanguage } from "@/lib/LanguageContext";
import { getLabel } from "@/lib/i18n";

export default function Home() {
  const { language } = useLanguage();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveEntries(entries);
  }, [entries, loaded]);

  function handleAdd(entry: Omit<Entry, "id">): string | null {
    const id = Date.now() + "-" + Math.random().toString(36).slice(2);
    setEntries((prev) => [...prev, { ...entry, id }]);
    setFormOpen(false);
    return null;
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function handleExport() {
    if (entries.length === 0) {
      alert(getLabel("empty.noRecordsToExport", language));
      return;
    }
    exportEntries(entries);
  }

  return (
    <div className="flex h-dvh flex-col">
      <TopBar entries={entries} />
      <StatsStrip entries={entries} />
      <div className="min-h-0 flex-1">
        <AssetChart entries={entries} />
      </div>
      <BottomBar
        onOpenLog={() => setLogOpen(true)}
        onExport={handleExport}
        onOpenForm={() => setFormOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <EntrySheet
        open={formOpen}
        entries={entries}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
      <LogSheet
        open={logOpen}
        entries={entries}
        onClose={() => setLogOpen(false)}
        onDelete={handleDelete}
      />
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
