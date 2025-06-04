'use client';
import { Trash2, Loader2 } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTaskContext } from '@context/task-context';
import { cn } from '@lib/utils';

export function Tasks() {
  const { filteredTasks, filter, loading, toggleComplete, deleteTask } =
    useTaskContext();

  return (
    <div className="flex-1 space-y-2 overflow-y-auto pr-1">
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center">
          {filter === 'all'
            ? 'Add some tasks to get started!'
            : filter === 'active'
              ? 'No active tasks'
              : 'No completed tasks'}
        </p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-center justify-between rounded-lg p-3 transition-all',
              'hover:bg-accent/50 group',
              task.completed && 'bg-muted',
            )}
          >
            <div className="flex flex-1 items-center space-x-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleComplete(task.id)}
              />
              <span
                className={cn(
                  'flex-1 transition-all',
                  task.completed && 'text-muted-foreground line-through',
                )}
              >
                {task.text}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTask(task.id)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete task"
            >
              <Trash2 className="text-muted-foreground hover:text-destructive h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
