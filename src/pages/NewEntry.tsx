import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const NewEntry = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: entryData, error: saveError } = await supabase
        .from('journal_entries')
        .insert({
          title,
          content,
          user_id: session.user.id,
          is_analyzed: false
        })
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Your journal entry has been saved.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-sm border border-[#D6BCFA]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#6E59A5]">
              New Journal Entry
            </CardTitle>
            <p className="text-[#8E9196] mt-2 italic">
              "Write your thoughts with clarity, for they shape your reality."
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-[#7E69AB] mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a meaningful title"
                  disabled={isSubmitting}
                  className="border-[#D6BCFA] focus:ring-[#9b87f5]"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-[#7E69AB] mb-1"
                >
                  Your Thoughts
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, feelings, and experiences..."
                  className="min-h-[200px] border-[#D6BCFA] focus:ring-[#9b87f5]"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting}
                  className="border-[#D6BCFA] text-[#7E69AB] hover:bg-[#F1F0FB]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Entry"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewEntry;