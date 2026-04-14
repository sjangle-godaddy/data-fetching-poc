"use client";

import { useState } from "react";
import type { Todo } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  isPending?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isPending,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.title) {
      onEdit(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 transition-all dark:border-gray-700 ${
        isPending ? "animate-pulse opacity-60" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-blue-600"
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 rounded border border-blue-400 bg-transparent px-2 py-1 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => {
            setEditValue(todo.title);
            setIsEditing(true);
          }}
          className={`flex-1 cursor-pointer text-sm select-none ${
            todo.completed
              ? "text-gray-400 line-through dark:text-gray-500"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {todo.title}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
        title="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
    </div>
  );
}
