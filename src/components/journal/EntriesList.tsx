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
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-[#F1F0FB]">
        <p className="text-[#7E69AB]">No entries found for this time period.</p>
        <p className="text-sm text-[#8E9196] mt-2">Start your spiritual journey by creating a new entry.</p>
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