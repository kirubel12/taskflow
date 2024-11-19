"use client";

import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTask } from "@/components/create-task";
import { TaskList } from "@/components/task-list";
import { TasksSkeleton } from "@/components/tasks-skeleton";
import { TaskStats } from "@/components/stats/task-stats";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import type { Priority } from "@/hooks/use-tasks";

export default function HomePage() {
  noStore();

  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");

  const filterButtons: Array<{ value: Priority | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>
            Add a new task to your list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTask />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>
            Manage and track your tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskStats />

          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Filter by priority:</span>
              <div className="flex gap-4 mt-4">
                {filterButtons.map(({ value, label }) => (
                  <Button
                    key={value}
                    variant={selectedPriority === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPriority(value)}
                    className={
                      value === "all"
                        ? ""
                        : value === "high"
                        ? "text-red-500"
                        : value === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {value !== "all" && <Flag className="mr-2 h-4 w-4" />}
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <Suspense fallback={<TasksSkeleton />}>
              <TaskList priorityFilter={selectedPriority} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
