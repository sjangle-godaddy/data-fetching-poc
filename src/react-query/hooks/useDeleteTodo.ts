import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "@/lib/api";
import type { Todo } from "@/lib/types";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, { previous: Todo[] | undefined }>({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.filter((t) => t.id !== id)
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
