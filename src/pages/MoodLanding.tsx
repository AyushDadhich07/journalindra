import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoodInput } from "@/components/mood/MoodInput";
import { MoodStats } from "@/components/mood/MoodStats";
import { BookOpen, BarChart, Clock } from "lucide-react";

const MoodLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-[#333]">Gita Journal</h1>
          <Button 
            onClick={() => navigate("/dashboard")}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Journal
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#333] mb-4">
            Blend ancient wisdom with modern mindfulness
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your spiritual journey and gain insights through daily reflections
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-12 h-12 text-[#9b87f5] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mindful Journaling</h3>
            <p className="text-gray-600">Write in a zen-like environment with inspiring Gita quotes.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <BarChart className="w-12 h-12 text-[#9b87f5] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Gain deep personal insights through sentiment analysis.</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <Clock className="w-12 h-12 text-[#9b87f5] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
            <p className="text-gray-600">Monitor your spiritual growth over time.</p>
          </div>
        </div>

        {/* Mood Tracking Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <MoodStats />
          </div>
          <div className="order-1 md:order-2">
            <MoodInput />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F1F0FB] mt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[#333]">Gita Journal</h3>
              <p className="text-gray-600">Blending ancient wisdom with modern mindfulness</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-[#9b87f5]">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-[#9b87f5]">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-[#9b87f5]">Contact Us</a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600">
            © 2024 Gita Journal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoodLanding;