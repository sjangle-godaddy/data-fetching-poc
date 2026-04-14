import { getTodoById, updateTodo, deleteTodo, delay } from "@/lib/db";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">
) {
  await delay(200);
  const { id } = await ctx.params;
  const todo = getTodoById(id);
  if (!todo) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(todo);
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">
) {
  await delay(500);
  const { id } = await ctx.params;
  const body = await request.json();
  try {
    const updated = updateTodo(id, body);
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">
) {
  await delay(500);
  const { id } = await ctx.params;
  try {
    deleteTodo(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
