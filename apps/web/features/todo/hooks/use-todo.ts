"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { api } from "@repo/backend/convex/_generated/api";

import type { Id } from "@repo/backend/convex/_generated/dataModel";

export function useTodo() {
  const tasks = useQuery(api.tasks.queries.list);
  const createTask = useMutation(api.tasks.mutations.create);
  const toggleTask = useMutation(api.tasks.mutations.toggle);
  const deleteTask = useMutation(api.tasks.mutations.remove);

  const [newTaskText, setNewTaskText] = useState("");

  const trimmedNewTaskText = newTaskText.trim();
  const canAddTask = trimmedNewTaskText.length > 0;

  async function addTask() {
    if (!canAddTask) return;

    await createTask({ todo: trimmedNewTaskText });
    setNewTaskText("");
  }

  async function toggleTaskById(id: Id<"tasks">) {
    await toggleTask({ id });
  }

  async function deleteTaskById(id: Id<"tasks">) {
    await deleteTask({ id });
  }

  return {
    addTask,
    canAddTask,
    deleteTaskById,
    newTaskText,
    setNewTaskText,
    tasks,
    toggleTaskById,
  };
}
