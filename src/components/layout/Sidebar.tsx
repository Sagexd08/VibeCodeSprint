
import { useState } from "react";
import { 
  BarChart3, CalendarDays, CheckSquare, GanttChartSquare, 
  Home, PlusCircle, Settings, Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", icon: Home, isActive: true },
  { name: "Habits", icon: CheckSquare, isActive: false },
  { name: "Calendar", icon: CalendarDays, isActive: false },
  { name: "Analytics", icon: BarChart3, isActive: false },
  { name: "Goals", icon: Target, isActive: false },
  { name: "Projects", icon: GanttChartSquare, isActive: false },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -300, opacity: 0 },
  };

  const overlayVariants = {
    open: { opacity: 0.5 },
    closed: { opacity: 0 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar border-r",
          "md:sticky md:translate-x-0 md:opacity-100",
          !isOpen && "md:block hidden"
        )}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 h-8">
            <span className="text-lg font-bold text-primary">Habitify</span>
          </div>
          
          <Button 
            className="mb-6 gap-2" 
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Habit</span>
          </Button>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant={item.isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-normal", 
                  item.isActive ? "bg-accent text-accent-foreground" : ""
                )}
                size="sm"
              >
                <item.icon className={cn("h-4 w-4", item.isActive && "text-primary")} />
                <span>{item.name}</span>
              </Button>
            ))}
          </nav>

          <div className="mt-auto">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-3 font-normal">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
