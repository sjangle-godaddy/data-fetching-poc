"use client";

import { useUser } from "@/react-query/hooks/useUser";
import { useUserPosts } from "@/react-query/hooks/useUserPosts";
import PostCard from "@/components/PostCard";

export default function UserDetail({ userId }: { userId: string }) {
  const { data: user, isLoading: userLoading, error: userError } = useUser(userId);
  const { data: posts, isLoading: postsLoading, error: postsError } = useUserPosts(userId);

  if (userLoading) return <p className="text-gray-500">Loading user...</p>;
  if (userError) return <p className="text-red-500">Error loading user.</p>;
  if (!user) return null;

  return (
    <div>
      <div className="mb-6 rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500">@{user.username}</p>
        <div className="mt-3 space-y-1 text-sm">
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>Website: {user.website}</p>
          <p>Company: {user.company?.name}</p>
          <p>Address: {user.address?.street}, {user.address?.city}</p>
        </div>
      </div>

      <h3 className="mb-4 text-xl font-semibold">Posts</h3>
      {postsLoading && <p className="text-gray-500">Loading posts...</p>}
      {postsError && <p className="text-red-500">Error loading posts.</p>}
      {posts && (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
