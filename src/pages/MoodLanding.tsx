import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoodInput } from "@/components/mood/MoodInput";
import { MoodStats } from "@/components/mood/MoodStats";
import { BookOpen } from "lucide-react";

const MoodLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF5E6] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#4A154B]">Journey Within</h1>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-[#4A154B] hover:bg-[#4A154B]/90"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Journal Entries
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <MoodStats />
          </div>
          <div className="order-1 md:order-2">
            <MoodInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodLanding;