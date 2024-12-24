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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

      // First save the entry without analysis
      const { data: entryData, error: saveError } = await supabase
        .from('journal_entries')
        .insert({
          title,
          content,
          user_id: session.user.id
        })
        .select()
        .single();

      if (saveError) throw saveError;

      toast({
        title: "Success",
        description: "Your journal entry has been saved. Starting AI analysis...",
      });

      // Then start AI analysis
      setIsAnalyzing(true);
      const analysisResponse = await supabase.functions.invoke('analyze-entry', {
        body: { 
          title, 
          content,
          prompt: `Reflect deeply on the user's journal entry, focusing on their specific emotions, experiences, and challenges.
          Relate their situation to the teachings of the Bhagavad Gita, using concepts such as dharma (duty), karma (selfless action), detachment, balance, and equanimity. The goal is to connect the Gita's wisdom to the user's particular context in a way that feels personal and practical.
          
          Start by acknowledging the user's experience in detail—highlight specific aspects of what they shared to show understanding. Then, relate these details to relevant verses from the Gita and their philosophical insights. Finally, offer guidance or suggestions tailored to their situation, ensuring it resonates with their entry.
          
          Avoid generalized advice; instead, directly address the user's reflections and show how the teachings can illuminate their path forward. Focus on how the Gita can provide clarity or comfort in their unique moment.`
        },
      });

      if (analysisResponse.error) throw analysisResponse.error;

      // Update the entry with the AI analysis
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ ai_analysis: analysisResponse.data.analysis })
        .eq('id', entryData.id);

      if (updateError) throw updateError;

      toast({
        title: "Analysis Complete",
        description: "Your entry has been analyzed with spiritual insights.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to save or analyze your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6] p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#4A154B]">
              New Journal Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your entry a meaningful title"
                  disabled={isSubmitting || isAnalyzing}
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Thoughts
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, feelings, and experiences..."
                  className="min-h-[200px]"
                  disabled={isSubmitting || isAnalyzing}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isSubmitting || isAnalyzing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#FF5733] hover:bg-[#FF5733]/90"
                  disabled={isSubmitting || isAnalyzing}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
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