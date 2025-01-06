import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/journal/EmptyState";
import { EntryFilter } from "@/components/journal/EntryFilter";
import { EntriesList } from "@/components/journal/EntriesList";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { useFilteredEntries } from "@/hooks/useFilteredEntries";
import { useJournalEntries } from "@/hooks/useJournalEntries";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { entries, loading, analyzingEntryId, handleAnalyze, handleDelete } = useJournalEntries();
  const { filteredEntries, setFilterType } = useFilteredEntries(entries);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <JournalHeader onSignOut={handleSignOut} />
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-[#F1F0FB]">
          <p className="text-center text-gray-600 italic mb-4">
            "The mind acts like an enemy for those who do not control it."
          </p>
          <p className="text-sm text-center text-gray-500">- Bhagavad Gita</p>
        </div>
        <EntryFilter onFilterChange={setFilterType} />

        {loading ? (
          <div className="text-center py-8 text-[#7E69AB] animate-pulse">
            Loading your spiritual journey...
          </div>
        ) : entries.length === 0 ? (
          <EmptyState />
        ) : (
          <EntriesList
            entries={filteredEntries}
            analyzingEntryId={analyzingEntryId}
            onAnalyze={handleAnalyze}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;