import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { startOfWeek, endOfWeek, format, subDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MoodStats() {
  const { data: moodEntries = [] } = useQuery({
    queryKey: ["mood-entries"],
    queryFn: async () => {
      const startDate = startOfWeek(new Date());
      const endDate = endOfWeek(new Date());

      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, "EEE");
  });

  const moodData = last7Days.map((day) => {
    const dayMoods = moodEntries.filter(
      (entry) => format(new Date(entry.created_at), "EEE") === day
    );

    return {
      day,
      good: dayMoods.filter((entry) => entry.mood === "good").length,
      neutral: dayMoods.filter((entry) => entry.mood === "neutral").length,
      bad: dayMoods.filter((entry) => entry.mood === "bad").length,
    };
  });

  const config = {
    good: {
      color: "#9b87f5",
    },
    neutral: {
      color: "#7E69AB",
    },
    bad: {
      color: "#F1F0FB",
    },
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-[#F1F0FB]">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#333]">Your Spiritual Journey</h2>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData}>
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="good" stackId="mood" fill={config.good.color} />
              <Bar dataKey="neutral" stackId="mood" fill={config.neutral.color} />
              <Bar dataKey="bad" stackId="mood" fill={config.bad.color} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-600 italic">
          "The wise see that there is action in the midst of inaction and inaction in the midst of action."
        </p>
        <p className="text-sm text-gray-500">- Bhagavad Gita</p>
      </div>
    </Card>
  );
}