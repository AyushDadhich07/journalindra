import { EntryCard } from "./EntryCard";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  ai_analysis: string | null;
  is_analyzed: boolean;
}

interface EntriesListProps {
  entries: JournalEntry[];
  analyzingEntryId: string | null;
  onAnalyze: (entryId: string) => void;
  onDelete: (entryId: string) => void;
}

export const EntriesList = ({ 
  entries, 
  analyzingEntryId, 
  onAnalyze, 
  onDelete 
}: EntriesListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No entries found for this time period.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          analyzingEntryId={analyzingEntryId}
          onAnalyze={onAnalyze}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};