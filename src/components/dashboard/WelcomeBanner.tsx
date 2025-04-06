
import { motion } from "framer-motion";

interface WelcomeBannerProps {
  username?: string;
}

export function WelcomeBanner({ username = "Alex" }: WelcomeBannerProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting()}, {username}
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's your habit progress for today.
      </p>
    </motion.div>
  );
}
