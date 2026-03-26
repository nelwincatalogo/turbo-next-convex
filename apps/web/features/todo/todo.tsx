"use client";

import { TodoView } from "./components/todo-view";
import { useTodo } from "./hooks/use-todo";

export default function Todo() {
  const {
    addTask,
    canAddTask,
    deleteTaskById,
    newTaskText,
    setNewTaskText,
    tasks,
    toggleTaskById,
  } = useTodo();

  return (
    <TodoView
      tasks={tasks}
      newTaskText={newTaskText}
      canAddTask={canAddTask}
      onNewTaskTextChange={setNewTaskText}
      onAddTask={addTask}
      onTaskToggle={toggleTaskById}
      onTaskDelete={deleteTaskById}
    />
  );
}
