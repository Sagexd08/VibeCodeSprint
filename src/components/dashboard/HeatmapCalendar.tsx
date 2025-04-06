
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HeatmapCalendarProps {
  data: {
    date: Date;
    value: number;
  }[];
  title?: string;
}

export function HeatmapCalendar({ data, title = "Activity Calendar" }: HeatmapCalendarProps) {
  // Generate last 7 days for the week view
  const weekData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Find matching data or default to 0
      const matchingData = data.find(
        (d) => d.date.toDateString() === date.toDateString()
      );
      
      return {
        date,
        value: matchingData?.value || 0,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      };
    }).reverse();
  }, [data]);

  // Color intensity based on value (0-4)
  const getIntensityClass = (value: number) => {
    if (value === 0) return "bg-secondary";
    if (value === 1) return "bg-primary/20";
    if (value === 2) return "bg-primary/40";
    if (value === 3) return "bg-primary/70";
    return "bg-primary";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            {weekData.map((day, index) => (
              <motion.div
                key={day.date.toISOString()}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className="text-xs text-muted-foreground mb-1">
                  {day.dayName}
                </span>
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center text-xs",
                    getIntensityClass(day.value)
                  )}
                >
                  {day.date.getDate()}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-2 gap-1">
            <div className="text-xs text-muted-foreground">Less</div>
            {[0, 1, 2, 3, 4].map((value) => (
              <div
                key={value}
                className={cn(
                  "w-3 h-3 rounded-sm",
                  getIntensityClass(value)
                )}
              ></div>
            ))}
            <div className="text-xs text-muted-foreground">More</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
