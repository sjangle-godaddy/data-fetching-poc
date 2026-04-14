"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import ReduxProvider from "@/redux/provider";
import UserDetail from "@/components/redux/UserDetail";
import CreatePostForm from "@/components/redux/CreatePostForm";

export default function ReduxUserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  return (
    <ReduxProvider>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Detail (Redux + Reduxful)</h1>
          <Link
            href="/redux"
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to Users
          </Link>
        </div>
        <UserDetail userId={userId} />
        <CreatePostForm userId={Number(userId)} />
      </div>
    </ReduxProvider>
  );
}
