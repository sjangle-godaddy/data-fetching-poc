import type { Post } from "@/lib/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h4 className="font-semibold capitalize">{post.title}</h4>
      <p className="mt-1 text-sm text-gray-600">{post.body}</p>
    </div>
  );
}
