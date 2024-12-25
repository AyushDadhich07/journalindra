import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smile, Meh, Frown } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const moods = [
  { value: "good", icon: Smile, label: "Good" },
  { value: "neutral", icon: Meh, label: "Neutral" },
  { value: "bad", icon: Frown, label: "Bad" },
] as const;

export function MoodInput() {
  const [selectedMood, setSelectedMood] = useState<typeof moods[number]["value"] | null>(null);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to record your mood.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("mood_entries")
        .insert({
          mood: selectedMood,
          note: note.trim() || null,
          user_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Mood recorded",
        description: "Your mood has been successfully recorded.",
      });

      setSelectedMood(null);
      setNote("");
    } catch (error) {
      console.error("Error recording mood:", error);
      toast({
        title: "Error",
        description: "Failed to record your mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">How are you feeling today?</h2>
      <div className="flex gap-4 justify-center mb-6">
        {moods.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={selectedMood === value ? "default" : "outline"}
            className="flex flex-col gap-2 h-auto p-4"
            onClick={() => setSelectedMood(value)}
          >
            <Icon className="h-8 w-8" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
      <Textarea
        placeholder="Add a note about how you're feeling (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-4"
      />
      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={!selectedMood}
      >
        Record Mood
      </Button>
    </Card>
  );
}