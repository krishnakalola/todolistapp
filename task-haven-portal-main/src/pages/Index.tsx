import { useState, useEffect } from "react";
import { TodoItem } from "@/components/TodoItem";
import { TodoInput } from "@/components/TodoInput";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  user_id: string;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
      // Subscribe to changes
      const subscription = supabase
        .channel('todos')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'todos',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchTodos();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('priority', { ascending: false });

    if (error) {
      toast({
        description: "Error fetching todos",
        variant: "destructive",
      });
      return;
    }
    setTodos(data || []);
  };

  const addTodo = async (text: string, priority: "low" | "medium" | "high") => {
    if (!user) return;
    const newTodo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      user_id: user.id,
    };

    const { error } = await supabase.from('todos').insert([newTodo]);

    if (error) {
      toast({
        description: "Error adding todo",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: "Todo added successfully!",
    });
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id);

    if (error) {
      toast({
        description: "Error updating todo",
        variant: "destructive",
      });
      return;
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      toast({
        description: "Error deleting todo",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: "Todo deleted successfully!",
      variant: "destructive",
    });
  };

  const changePriority = async (id: string, priority: "low" | "medium" | "high") => {
    const { error } = await supabase
      .from('todos')
      .update({ priority })
      .eq('id', id);

    if (error) {
      toast({
        description: "Error updating priority",
        variant: "destructive",
      });
      return;
    }

    toast({
      description: `Priority changed to ${priority}!`,
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        description: "Signed out successfully!",
      });
    } catch (error) {
      toast({
        description: "Error signing out",
        variant: "destructive",
      });
    }
  };

  // Sort todos by priority (high -> medium -> low) and then by completion status
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-todo-bg/30 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-todo-accent">Todo List</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
        <TodoInput onAdd={addTodo} />
        <div className="mt-8 space-y-3">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onPriorityChange={changePriority}
            />
          ))}
          {todos.length === 0 && (
            <p className="text-center text-muted-foreground">
              No todos yet. Add one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;