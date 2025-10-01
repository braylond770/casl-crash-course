import { db } from "@/drizzle/db"
import { todo } from "@/drizzle/schema"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { and, desc, eq } from "drizzle-orm"
import { UnauthenticatedError, UnauthorizedError } from "../errors"
import { canReadTodo } from "@/lib/permissions/todos"
import { drizzleWhere } from "@/lib/permissions/drizzleAdapter"

export async function getUserTodos() {
  const user = await getCurrentUser()
  if (user == null) throw new UnauthenticatedError()

  return await db.query.todo.findMany({
    where: and(
      eq(todo.userId, user.id),
      drizzleWhere("read", "Todo", user, todo)
    ),
    orderBy: desc(todo.createdAt),
  })
}
export async function getAllTodosWithUsers() {
  const user = await getCurrentUser()

  if (!canReadTodo({ user })) {
    throw new UnauthorizedError()
  }

  return await db.query.todo.findMany({
    with: { user: true },
    where: drizzleWhere("read", "Todo", user, todo),
    orderBy: desc(todo.createdAt),
  })
}
