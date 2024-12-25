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
      color: "#22c55e",
    },
    neutral: {
      color: "#f59e0b",
    },
    bad: {
      color: "#ef4444",
    },
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Mood This Week</h2>
      <div className="h-[300px]">
        <ChartContainer config={config}>
          <BarChart data={moodData}>
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="good" stackId="mood" fill={config.good.color} />
            <Bar dataKey="neutral" stackId="mood" fill={config.neutral.color} />
            <Bar dataKey="bad" stackId="mood" fill={config.bad.color} />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}