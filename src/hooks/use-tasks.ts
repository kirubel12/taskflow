/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { useEffect, useState } from "react";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
};

const STORAGE_KEY = "taskflow-tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error("Error saving tasks:", error);
      }
    }
  }, [tasks, isLoading]);

  const addTask = (title: string, priority: Priority = "medium") => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTaskPriority = (taskId: string, priority: Priority) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, priority } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const sortByPriority = () => {
    const priorityOrder: Record<Priority, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };
    
    setTasks((prev) => 
      [...prev].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    );
  };

  const getFilteredTasks = (priorityFilter: Priority | "all" = "all") => {
    return priorityFilter === "all"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    updateTaskPriority,
    sortByPriority,
    getFilteredTasks,
  };
}