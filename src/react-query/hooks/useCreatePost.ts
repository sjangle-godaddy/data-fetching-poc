import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/lib/api";
import type { Post, CreatePostInput } from "@/lib/types";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<Post, Error, CreatePostInput>({
    mutationFn: (newPost) =>
      fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      }).then((res) => res.json()),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["users", String(variables.userId), "posts"],
      });
    },
  });
}
