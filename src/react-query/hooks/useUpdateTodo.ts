import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import type { Todo, UpdateTodoInput } from "@/lib/types";

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, { id: string } & UpdateTodoInput, { previous: Todo[] | undefined }>({
    mutationFn: async ({ id, ...input }) => {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      return res.json();
    },
    onMutate: async ({ id, ...input }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...input } : t))
      );
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
