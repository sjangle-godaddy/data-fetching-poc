"use client";

import { useUsers } from "@/react-query/hooks/useUsers";
import UserCard from "@/components/UserCard";

export default function UserList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <p className="text-gray-500">Loading users...</p>;
  if (error) return <p className="text-red-500">Error loading users.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} basePath="/react-query" />
      ))}
    </div>
  );
}
