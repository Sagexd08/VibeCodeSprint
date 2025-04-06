
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useHabits, Habit } from "@/lib/useHabits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Habits() {
  const { user, isLoading: authLoading } = useAuth();
  const { habits, isLoading: habitsLoading, fetchHabits, createHabit, completeHabit } = useHabits();
  const [open, setOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "daily",
    color: "#4F46E5",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [completingIds, setCompletingIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchHabits();
    }
  }, [user, authLoading, navigate, fetchHabits]);

  const handleCreateHabit = async () => {
    setIsCreating(true);
    try {
      await createHabit(newHabit);
      setNewHabit({
        name: "",
        description: "",
        frequency: "daily",
        color: "#4F46E5",
      });
      setOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    setCompletingIds(prev => [...prev, habitId]);
    try {
      await completeHabit(habitId);
      toast({
        title: "Habit Completed",
        description: "Keep up the good work!",
      });
    } finally {
      setCompletingIds(prev => prev.filter(id => id !== habitId));
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Your Habits
        </motion.h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Add a new habit to track. Be specific about what you want to achieve.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Drink Water, Read, Exercise"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Why this habit is important to you"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newHabit.frequency}
                    onValueChange={(value) => setNewHabit({ ...newHabit, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newHabit.color}
                    onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
                    className="h-10 p-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateHabit}
                disabled={!newHabit.name || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Habit"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {habitsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : habits.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onComplete={handleCompleteHabit}
              isCompleting={completingIds.includes(habit.id)}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-16 rounded-lg border-2 border-dashed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mx-auto flex flex-col items-center justify-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No habits yet</h3>
            <p className="text-muted-foreground max-w-md">
              Create your first habit to start tracking your progress and build better routines.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Habit
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
  isCompleting: boolean;
}

function HabitCard({ habit, onComplete, isCompleting }: HabitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color || "#4F46E5" }}
            />
            <CardTitle className="text-lg">{habit.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {habit.description && (
            <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">{getFrequencyLabel(habit.frequency)}</span>
            <span>•</span>
            <span>{habit.streak} day streak</span>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-2">
          <Button
            variant="ghost"
            className="w-full justify-center gap-2"
            onClick={() => onComplete(habit.id)}
            disabled={isCompleting}
          >
            {isCompleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>Complete</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  function getFrequencyLabel(frequency: string) {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  }
}
