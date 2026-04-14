import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/api";
import type { User } from "@/lib/types";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch(`${BASE_URL}/users`).then((res) => res.json()),
  });
}
