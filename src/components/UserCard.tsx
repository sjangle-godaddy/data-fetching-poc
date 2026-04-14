import Link from "next/link";
import type { User } from "@/lib/types";

export default function UserCard({
  user,
  basePath,
}: {
  user: User;
  basePath: string;
}) {
  return (
    <Link
      href={`${basePath}/${user.id}`}
      className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-400 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-500">@{user.username}</p>
      <p className="mt-1 text-sm">{user.email}</p>
      <p className="text-sm text-gray-400">{user.company.name}</p>
    </Link>
  );
}
