"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ReactQueryProvider from "@/react-query/provider";
import UserDetail from "@/components/react-query/UserDetail";
import CreatePostForm from "@/components/react-query/CreatePostForm";

export default function ReactQueryUserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  return (
    <ReactQueryProvider>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Detail (React Query)</h1>
          <Link
            href="/react-query"
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Users
          </Link>
        </div>
        <UserDetail userId={userId} />
        <CreatePostForm userId={Number(userId)} />
      </div>
    </ReactQueryProvider>
  );
}
