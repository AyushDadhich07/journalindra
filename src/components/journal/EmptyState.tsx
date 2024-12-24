import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
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
  );
};