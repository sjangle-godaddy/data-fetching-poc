import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import type { Todo } from "@/lib/types";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, { title: string }, { previous: Todo[] | undefined }>({
    mutationFn: async ({ title }) => {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create todo");
      return res.json();
    },
    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) => [
        {
          id: "optimistic-" + Date.now(),
          title,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...(old ?? []),
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
