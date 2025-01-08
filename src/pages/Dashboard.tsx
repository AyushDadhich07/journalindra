import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/journal/EmptyState";
import { EntryFilter } from "@/components/journal/EntryFilter";
import { EntriesList } from "@/components/journal/EntriesList";
import { JournalHeader } from "@/components/journal/JournalHeader";
import { useFilteredEntries } from "@/hooks/useFilteredEntries";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { Button } from "@/components/ui/button";
import { Home, PenSquare, UserCircle } from "lucide-react";

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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F1F0FB] py-4 px-6 z-50">
        <div className="max-w-4xl mx-auto flex justify-center space-x-8">
          <Button
            variant="ghost"
            className="text-[#6E59A5] hover:bg-[#F1F0FB]"
            onClick={() => navigate("/mood")}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="text-[#6E59A5] hover:bg-[#F1F0FB]"
            onClick={() => navigate("/new-entry")}
          >
            <PenSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className="text-[#6E59A5] hover:bg-[#F1F0FB]"
            onClick={() => navigate("/profile")}
          >
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <JournalHeader onSignOut={handleSignOut} />
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-[#F1F0FB]">
          <p className="text-center text-[#7E69AB] italic mb-4">
            "The mind acts like an enemy for those who do not control it."
          </p>
          <p className="text-sm text-center text-[#8E9196]">- Bhagavad Gita</p>
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