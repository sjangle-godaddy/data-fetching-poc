import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/api";
import type { User } from "@/lib/types";

export function useUser(userId: string) {
  return useQuery<User>({
    queryKey: ["users", userId],
    queryFn: () => fetch(`${BASE_URL}/users/${userId}`).then((res) => res.json()),
  });
}
