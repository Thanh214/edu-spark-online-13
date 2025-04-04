
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const Spinner = ({ size = "md", className, text }: SpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={cn(
          "rounded-full border-2 border-t-transparent",
          sizeClasses[size],
          size === "sm" ? "border-2" : "border-4",
          "border-edu-primary"
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-gray-500">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
