import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TodoInputProps {
  onAdd: (text: string, priority: "low" | "medium" | "high") => void;
}

export const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
        className="border-todo-accent/20 focus-visible:ring-todo-accent"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button
        type="submit"
        className="bg-todo-accent text-white hover:bg-todo-hover"
      >
        <Plus size={20} />
      </Button>
    </form>
  );
};