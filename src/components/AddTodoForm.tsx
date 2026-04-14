"use client";

import { useState } from "react";

interface AddTodoFormProps {
  onAdd: (title: string) => void;
  isPending?: boolean;
}

export default function AddTodoForm({ onAdd, isPending }: AddTodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none transition-colors focus:border-blue-500 dark:border-gray-600"
      />
      <button
        type="submit"
        disabled={isPending || !title.trim()}
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
