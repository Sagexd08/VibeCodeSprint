
import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  created_at: string;
  user_id: string;
  streak: number;
  color: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  user_id: string;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setHabits(data || []);
    } catch (error: any) {
      console.error("Error fetching habits:", error);
      toast({
        title: "Failed to fetch habits",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Fetch habits when the user changes
  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user, fetchHabits]);

  const createHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'user_id' | 'streak'>) => {
    if (!user) return null;
    
    try {
      const newHabit = {
        ...habitData,
        user_id: user.id,
        streak: 0,
      };
      
      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Habit created",
        description: `${habitData.name} has been added to your habits`,
      });
      
      await fetchHabits();
      return data?.[0] || null;
    } catch (error: any) {
      console.error("Error creating habit:", error);
      toast({
        title: "Failed to create habit",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const completeHabit = async (habitId: string) => {
    if (!user) return false;
    
    try {
      // Get the habit first to check current streak
      const { data: habitData, error: habitError } = await supabase
        .from('habits')
        .select('*')
        .eq('id', habitId)
        .single();
        
      if (habitError) throw habitError;
      
      // Record completion
      const { error: completionError } = await supabase
        .from('habit_completions')
        .insert([
          {
            habit_id: habitId,
            user_id: user.id,
            completed_at: new Date().toISOString(),
          }
        ]);
        
      if (completionError) throw completionError;
      
      // Update streak
      const { error: updateError } = await supabase
        .from('habits')
        .update({ streak: (habitData?.streak || 0) + 1 })
        .eq('id', habitId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Habit completed",
        description: "Great job keeping up with your habit!",
      });
      
      await fetchHabits();
      return true;
    } catch (error: any) {
      console.error("Error completing habit:", error);
      toast({
        title: "Failed to complete habit",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    habits,
    isLoading,
    fetchHabits,
    createHabit,
    completeHabit
  };
}
