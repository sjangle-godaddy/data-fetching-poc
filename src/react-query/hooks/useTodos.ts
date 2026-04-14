import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import type { Todo } from "@/lib/types";

export function useTodos() {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch todos");
      return res.json();
    },
  });
}
