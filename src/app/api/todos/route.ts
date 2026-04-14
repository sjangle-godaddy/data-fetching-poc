import { getAllTodos, createTodo, delay } from "@/lib/db";

export async function GET() {
  await delay(300);
  const todos = getAllTodos();
  return Response.json(todos);
}

export async function POST(request: Request) {
  await delay(500);
  const { title } = await request.json();
  if (!title || typeof title !== "string") {
    return Response.json({ error: "title is required" }, { status: 400 });
  }
  const todo = createTodo({ title });
  return Response.json(todo, { status: 201 });
}
