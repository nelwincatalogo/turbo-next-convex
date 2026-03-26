"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Input } from "@repo/ui/components/ui/input";
import { cn } from "@repo/ui/lib/utils";

import type { Doc, Id } from "@repo/backend/convex/_generated/dataModel";
import type { KeyboardEvent } from "react";

type TodoViewProps = {
  tasks: Doc<"tasks">[] | undefined;
  newTaskText: string;
  canAddTask: boolean;
  onNewTaskTextChange: (value: string) => void;
  onAddTask: () => void | Promise<void>;
  onTaskToggle: (id: Id<"tasks">) => void | Promise<void>;
  onTaskDelete: (id: Id<"tasks">) => void | Promise<void>;
};

export function TodoView({
  tasks,
  newTaskText,
  canAddTask,
  onNewTaskTextChange,
  onAddTask,
  onTaskToggle,
  onTaskDelete,
}: TodoViewProps) {
  function handleTaskInputKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      void onAddTask();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Todo List</h1>

        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(event) => onNewTaskTextChange(event.target.value)}
            onKeyUp={handleTaskInputKeyUp}
            className="flex-1"
          />
          <Button onClick={() => void onAddTask()} disabled={!canAddTask}>
            Add
          </Button>
        </div>

        <ul className="space-y-1">
          {tasks?.map((task) => (
            <li
              key={task._id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/50",
                task.completed && "opacity-60",
              )}
            >
              <div className="flex flex-1 items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => void onTaskToggle(task._id)}
                />
                <span
                  className={cn("text-sm", task.completed && "text-muted-foreground line-through")}
                >
                  {task.todo}
                </span>
              </div>
              <Button variant="ghost" size="icon-xs" onClick={() => void onTaskDelete(task._id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}

          {tasks?.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">
              No tasks yet. Add one above!
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
