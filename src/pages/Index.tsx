
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Calendar, CheckSquare, Flame, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useHabits } from "@/lib/useHabits";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { HabitCard } from "@/components/habits/HabitCard";
import { HeatmapCalendar } from "@/components/dashboard/HeatmapCalendar";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { progressData, heatmapData } from "@/data/habitData";

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { habits, isLoading: habitsLoading, fetchHabits } = useHabits();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user, fetchHabits]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">Welcome to Habitify</h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Track your habits, build routines, and improve your life one day at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <WelcomeBanner />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Habits Tracked"
          value={habits.length.toString()}
          description="Total active habits"
          icon={CheckSquare}
          delay={0}
        />
        <StatsCard
          title="Completion Rate"
          value="87%"
          description="This week"
          trend="up"
          trendValue="+4%"
          icon={Activity}
          delay={1}
        />
        <StatsCard
          title="Current Streak"
          value={habits.length > 0 ? Math.max(...habits.map(h => h.streak)).toString() : "0"}
          description="Days in a row"
          icon={Flame}
          delay={2}
        />
        <StatsCard
          title="Perfect Days"
          value="8"
          description="This month"
          icon={Calendar}
          delay={3}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProgressChart data={progressData} />
        </div>
        <div>
          <HeatmapCalendar data={heatmapData} />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Habits</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/habits">View All</Link>
          </Button>
        </div>

        {habitsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.slice(0, 3).map((habit, index) => (
              <HabitCard 
                key={habit.id} 
                habit={{
                  id: habit.id,
                  name: habit.name,
                  streak: habit.streak,
                  progress: 75, // Placeholder
                  category: habit.frequency,
                  color: habit.color,
                  daysCompleted: 3, // Placeholder
                  daysTotal: 4, // Placeholder
                }} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg border-dashed">
            <p className="text-muted-foreground mb-4">You haven't created any habits yet.</p>
            <Button asChild>
              <Link to="/habits">Create Your First Habit</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Index;
