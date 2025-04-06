
import { CheckCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    streak: number;
    progress: number;
    category: string;
    color?: string;
    daysCompleted: number;
    daysTotal: number;
  };
  index: number;
}

export function HabitCard({ habit, index }: HabitCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="card-hover overflow-hidden border">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full",
                  habit.color || "bg-primary"
                )} 
              />
              <h3 className="font-medium">{habit.name}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>{habit.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="font-medium text-foreground">{habit.streak}</span> day streak
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{habit.daysCompleted}/{habit.daysTotal} days</span>
            </div>
            <Progress 
              value={habit.progress} 
              className={cn("h-2", getProgressColor(habit.progress))}
            />
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/30 flex justify-between">
          <span className="text-xs text-muted-foreground">Today</span>
          <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span>Mark complete</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
