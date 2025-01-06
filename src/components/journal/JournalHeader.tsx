import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, UserCircle, Home } from "lucide-react";

interface JournalHeaderProps {
  onSignOut: () => Promise<void>;
}

export const JournalHeader = ({ onSignOut }: JournalHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 mb-8">
      <h1 className="text-3xl font-bold text-[#6E59A5] text-center">Your Spiritual Journal</h1>
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => navigate("/mood")}
          variant="outline"
          className="bg-white border-[#D6BCFA] text-[#7E69AB] hover:bg-[#F1F0FB]"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          onClick={() => navigate("/profile")}
          variant="outline"
          className="border-[#D6BCFA] text-[#7E69AB] hover:bg-[#F1F0FB]"
        >
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button
          onClick={() => navigate("/new-entry")}
          className="bg-[#9b87f5] hover:bg-[#8B5CF6] text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
        <Button 
          variant="outline" 
          onClick={onSignOut}
          className="border-[#D6BCFA] text-[#7E69AB] hover:bg-[#F1F0FB]"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};