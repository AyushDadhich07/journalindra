import { format } from "date-fns";
import { Loader2, Wand2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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
  onDelete: (entryId: string) => void;
}

export const EntryCard = ({ entry, analyzingEntryId, onAnalyze, onDelete }: EntryCardProps) => {
  const [showInsights, setShowInsights] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-[#F1F0FB] bg-white">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-[#6E59A5]">
            {entry.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8E9196]">
              {format(new Date(entry.created_at), "MMM d, yyyy")}
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[#8E9196] hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this journal entry? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-[#D6BCFA] text-[#7E69AB]">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(entry.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-[#8E9196] leading-relaxed">{entry.content}</p>
        
        {!entry.is_analyzed && (
          <Button
            onClick={() => onAnalyze(entry.id)}
            disabled={analyzingEntryId === entry.id}
            variant="outline"
            className="w-full justify-center border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white transition-colors"
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
          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowInsights(!showInsights)}
              className="w-full justify-between text-[#6E59A5] hover:bg-[#F1F0FB]"
            >
              <span className="font-medium">Spiritual Insights</span>
              {showInsights ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {showInsights && (
              <div className="mt-4 p-6 bg-[#F1F0FB] rounded-lg border border-[#D6BCFA]">
                <p className="text-sm text-[#7E69AB] whitespace-pre-wrap leading-relaxed">
                  {entry.ai_analysis}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};