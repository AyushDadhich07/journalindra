import { useState, useMemo } from 'react';
import { startOfWeek, startOfMonth, startOfYear, isAfter } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  ai_analysis: string | null;
  is_analyzed: boolean;
}

export const useFilteredEntries = (entries: JournalEntry[]) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEntries = useMemo(() => {
    if (filterType === 'all') return entries;

    const now = new Date();
    let startDate: Date;

    switch (filterType) {
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      default:
        return entries;
    }

    return entries.filter(entry => 
      isAfter(new Date(entry.created_at), startDate)
    );
  }, [entries, filterType]);

  return {
    filteredEntries,
    setFilterType,
    filterType
  };
};