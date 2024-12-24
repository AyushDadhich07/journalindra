import { format } from "date-fns";
import { Loader2, Wand2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EntryCardProps {
  entry: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    ai_analysis: string | null;
    is_analyzed: boolean;
  };
  analyzingEntryId: string | null;
  onAnalyze: (entryId: string) => void;
}

export const EntryCard = ({ entry, analyzingEntryId, onAnalyze }: EntryCardProps) => {
  return (
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
            onClick={() => onAnalyze(entry.id)}
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
  );
};