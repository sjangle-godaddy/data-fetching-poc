import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/api";
import type { Post } from "@/lib/types";

export function useUserPosts(userId: string) {
  return useQuery<Post[]>({
    queryKey: ["users", userId, "posts"],
    queryFn: () => fetch(`${BASE_URL}/users/${userId}/posts`).then((res) => res.json()),
  });
}
