"use client";

import { useState } from "react";
import { useCreatePost } from "@/react-query/hooks/useCreatePost";

export default function CreatePostForm({ userId }: { userId: number }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const mutation = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      { userId, title, body },
      {
        onSuccess: () => {
          setTitle("");
          setBody("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-gray-200 p-4">
      <h3 className="mb-3 text-lg font-semibold">Create New Post (React Query)</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        required
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending ? "Submitting..." : "Create Post"}
      </button>
      {mutation.isSuccess && <p className="mt-2 text-sm text-green-600">Post created! (cache auto-invalidated)</p>}
      {mutation.isError && <p className="mt-2 text-sm text-red-600">Error creating post.</p>}
    </form>
  );
}
