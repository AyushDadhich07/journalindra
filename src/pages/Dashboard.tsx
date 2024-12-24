import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, BookOpen, LogOut, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  ai_analysis: string | null;
  is_analyzed: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingEntryId, setAnalyzingEntryId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAndFetchEntries = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          navigate("/");
          return;
        }

        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setEntries(data || []);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load your journal entries. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchEntries();
  }, [navigate, toast]);

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

  const handleAnalyze = async (entryId: string) => {
    setAnalyzingEntryId(entryId);
    const entry = entries.find(e => e.id === entryId);
    
    if (!entry) {
      toast({
        title: "Error",
        description: "Entry not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('analyze-entry', {
        body: { 
          title: entry.title, 
          content: entry.content,
          prompt: `Reflect deeply on the user's journal entry, focusing on their specific emotions, experiences, and challenges.
          Relate their situation to the teachings of the Bhagavad Gita, using concepts such as dharma (duty), karma (selfless action), detachment, balance, and equanimity. The goal is to connect the Gita's wisdom to the user's particular context in a way that feels personal and practical.
          
          Start by acknowledging the user's experience in detail—highlight specific aspects of what they shared to show understanding. Then, relate these details to relevant verses from the Gita and their philosophical insights. Finally, offer guidance or suggestions tailored to their situation, ensuring it resonates with their entry.
          
          Avoid generalized advice; instead, directly address the user's reflections and show how the teachings can illuminate their path forward. Focus on how the Gita can provide clarity or comfort in their unique moment.`
        },
      });

      if (response.error) throw response.error;

      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ 
          ai_analysis: response.data.analysis,
          is_analyzed: true 
        })
        .eq('id', entryId);

      if (updateError) throw updateError;

      // Update the local state
      setEntries(entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, ai_analysis: response.data.analysis, is_analyzed: true }
          : entry
      ));

      toast({
        title: "Success",
        description: "Entry has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzingEntryId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A154B]">Your Spiritual Journal</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/new-entry")}
              className="bg-[#FF5733] hover:bg-[#FF5733]/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Entry
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading your entries...</div>
        ) : entries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Entries Yet</h3>
              <p className="text-gray-600 mb-4">
                Start your spiritual journey by creating your first journal entry.
              </p>
              <Button
                onClick={() => navigate("/new-entry")}
                className="bg-[#FF5733] hover:bg-[#FF5733]/90"
              >
                Create Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold">
                      {entry.title}
                    </CardTitle>
                    <span className="text-sm text-gray-500">
                      {format(new Date(entry.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{entry.content}</p>
                  
                  {!entry.is_analyzed && (
                    <Button
                      onClick={() => handleAnalyze(entry.id)}
                      disabled={analyzingEntryId === entry.id}
                      variant="outline"
                      className="w-full justify-center"
                    >
                      {analyzingEntryId === entry.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Get Spiritual Insights
                        </>
                      )}
                    </Button>
                  )}
                  
                  {entry.ai_analysis && (
                    <div className="mt-6 p-4 bg-[#4A154B]/5 rounded-lg">
                      <h4 className="text-sm font-medium text-[#4A154B] mb-2">
                        Spiritual Insights
                      </h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {entry.ai_analysis}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;