"use client";

import { useState, useEffect } from "react";
import { Timer, BarChart3, Flag, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTasks, type Priority } from "@/hooks/use-tasks";
import { toast } from "@/hooks/use-toast";

const POMODORO_MINUTES = 25;

export function TaskStats() {
  const { tasks } = useTasks();
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_MINUTES * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [dailyGoal] = useState(5); // Example daily goal

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => {
          if (time <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "Pomodoro Complete!",
              description: "Take a break and start fresh!",
            });
            return POMODORO_MINUTES * 60;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setPomodoroTime(POMODORO_MINUTES * 60);
  };

  // Calculate statistics
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  
  const priorityStats = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  // Calculate daily progress
  const tasksCompletedToday = tasks.filter(
    (task) => 
      task.completed && 
      new Date(task.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const dailyProgress = (tasksCompletedToday / dailyGoal) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Task Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
          <Progress value={completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completionRate.toFixed(1)}% completion rate
          </p>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-16 text-red-500">High</div>
              <Progress value={(priorityStats.high / totalTasks) * 100} className="flex-1" />
              <span className="ml-2 text-sm">{priorityStats.high}</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-yellow-500">Medium</div>
              <Progress value={(priorityStats.medium / totalTasks) * 100} className="flex-1" />
              <span className="ml-2 text-sm">{priorityStats.medium}</span>
            </div>
            <div className="flex items-center">
              <div className="w-16 text-green-500">Low</div>
              <Progress value={(priorityStats.low / totalTasks) * 100} className="flex-1" />
              <span className="ml-2 text-sm">{priorityStats.low}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasksCompletedToday}/{dailyGoal}</div>
          <Progress value={dailyProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {dailyProgress.toFixed(1)}% of daily goal
          </p>
        </CardContent>
      </Card>

      {/* Pomodoro Timer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pomodoro Timer</CardTitle>
          <Timer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(pomodoroTime)}</div>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTimer}
              className="flex-1"
            >
              {isTimerRunning ? "Pause" : "Start"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetTimer}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}