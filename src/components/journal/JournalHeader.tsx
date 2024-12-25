import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut, UserCircle, Home } from "lucide-react";

interface JournalHeaderProps {
  onSignOut: () => Promise<void>;
}

export const JournalHeader = ({ onSignOut }: JournalHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-[#4A154B]">Your Spiritual Journal</h1>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/mood")}
          variant="outline"
          className="bg-white"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Button
          onClick={() => navigate("/profile")}
          variant="outline"
        >
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </Button>
        <Button
          onClick={() => navigate("/new-entry")}
          className="bg-[#FF5733] hover:bg-[#FF5733]/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};