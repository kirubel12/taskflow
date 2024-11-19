"use client";

import { useState, useTransition } from "react";
import { PlusCircle, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useTasks, type Priority } from "@/hooks/use-tasks";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateTask() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(() => {
      try {
        addTask(title.trim(), priority);
        setTitle("");
        toast({
          title: "Task created",
          description: "Your task has been created successfully.",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
        disabled={isPending}
      />
      <Select
        value={priority}
        onValueChange={(value: Priority) => setPriority(value)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high" className="text-red-500">
            <span className="flex items-center">
              <Flag className="mr-2 h-4 w-4" />
              High
            </span>
          </SelectItem>
          <SelectItem value="medium" className="text-yellow-500">
            <span className="flex items-center">
              <Flag className="mr-2 h-4 w-4" />
              Medium
            </span>
          </SelectItem>
          <SelectItem value="low" className="text-green-500">
            <span className="flex items-center">
              <Flag className="mr-2 h-4 w-4" />
              Low
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isPending}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </form>
  );
}