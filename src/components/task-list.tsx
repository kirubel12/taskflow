"use client";

import { Flag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useTasks, type Priority } from "@/hooks/use-tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priorityColors: Record<Priority, string> = {
  high: "text-red-700",
  medium: "text-yellow-700",
  low: "text-green-700",
};

interface TaskListProps {
  priorityFilter: Priority | "all";
}

export function TaskList({ priorityFilter }: TaskListProps) {
  const { toggleTask, deleteTask, updateTaskPriority, getFilteredTasks } = useTasks();
  const filteredTasks = getFilteredTasks(priorityFilter);

  const handleToggle = (taskId: string) => {
    toggleTask(taskId);
    toast({
      title: "Task updated",
      description: "Task status has been updated.",
    });
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: "Task deleted",
      description: "Task has been deleted successfully.",
    });
  };

  const handlePriorityChange = (taskId: string, priority: Priority) => {
    updateTaskPriority(taskId, priority);
    toast({
      title: "Priority updated",
      description: "Task priority has been updated.",
    });
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map((task, index) => (
        <div key={task.id}>
          {index > 0 && <Separator className="my-4" />}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 flex-1">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => handleToggle(task.id)}
              />
              <label
                htmlFor={task.id}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  task.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.title}
              </label>
            </div>
            <Select
              value={task.priority}
              onValueChange={(value: Priority) => handlePriorityChange(task.id, value)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue>
                  <span className={`flex items-center ${priorityColors[task.priority]}`}>
                    <Flag className="mr-2 h-4 w-4" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high" className="text-red-700">
                  <span className="flex items-center">
                    <Flag className="mr-2 h-4 w-4" />
                    High
                  </span>
                </SelectItem>
                <SelectItem value="medium" className="text-yellow-700">
                  <span className="flex items-center">
                    <Flag className="mr-2 h-4 w-4" />
                    Medium
                  </span>
                </SelectItem>
                <SelectItem value="low" className="text-green-700">
                  <span className="flex items-center">
                    <Flag className="mr-2 h-4 w-4" />
                    Low
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(task.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        </div>
      ))}
      {filteredTasks.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {priorityFilter === "all" 
            ? "No tasks yet. Add one above!"
            : `No ${priorityFilter} priority tasks found.`}
        </p>
      )}
    </div>
  );
}