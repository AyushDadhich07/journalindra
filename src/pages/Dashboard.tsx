import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, BookOpen, LogOut } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  ai_analysis: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      fetchEntries();
    };

    checkUser();
  }, [navigate]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
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
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{entry.content}</p>
                  {entry.ai_analysis && (
                    <div className="mt-4 p-4 bg-[#4A154B]/5 rounded-lg">
                      <h4 className="text-sm font-medium text-[#4A154B] mb-2">
                        Spiritual Insights
                      </h4>
                      <p className="text-sm text-gray-600">{entry.ai_analysis}</p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => navigate(`/entry/${entry.id}`)}
                  >
                    Read More
                  </Button>
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