import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: "low" | "medium" | "high") => void;
}

export const TodoItem = ({ 
  id, 
  text, 
  completed, 
  priority,
  onToggle, 
  onDelete,
  onPriorityChange 
}: TodoItemProps) => {
  const priorityColors = {
    low: "bg-gray-200 hover:bg-gray-300 cursor-pointer",
    medium: "bg-yellow-200 hover:bg-yellow-300 cursor-pointer",
    high: "bg-red-200 hover:bg-red-300 cursor-pointer"
  };

  const handlePriorityClick = () => {
    const nextPriority = {
      low: "medium",
      medium: "high",
      high: "low"
    }[priority] as "low" | "medium" | "high";
    
    onPriorityChange(id, nextPriority);
  };

  return (
    <div className="animate-slide-in flex items-center gap-3 rounded-lg bg-todo-bg p-4 shadow-sm transition-all hover:shadow-md">
      <Checkbox
        id={`todo-${id}`}
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="border-todo-accent data-[state=checked]:bg-todo-accent data-[state=checked]:text-white"
      />
      <label
        htmlFor={`todo-${id}`}
        className={cn(
          "flex-1 cursor-pointer text-sm transition-all",
          completed && "text-muted-foreground line-through"
        )}
      >
        {text}
      </label>
      <Badge 
        variant="secondary"
        className={cn(
          "mr-2 transition-colors",
          priorityColors[priority]
        )}
        onClick={handlePriorityClick}
      >
        {priority}
      </Badge>
      <button
        onClick={() => onDelete(id)}
        className="text-gray-400 transition-colors hover:text-red-500"
      >
        <X size={18} />
      </button>
    </div>
  );
};