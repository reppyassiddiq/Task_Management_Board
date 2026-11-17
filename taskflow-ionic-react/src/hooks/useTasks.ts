import { useEffect, useState } from 'react';
import { initialTasks } from '../data/seed';
import type { Task } from '../types/task';

const STORAGE_KEY = 'taskflow.tasks.v1';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) as Task[] : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  return { tasks, setTasks };
}
