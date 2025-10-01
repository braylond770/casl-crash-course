import { db } from "@/drizzle/db"
import { todo, user as UserTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { getUserPermissions } from "@/lib/permissions/getUserPermissions"
import { count, desc, eq } from "drizzle-orm"
import { UnauthorizedError } from "../errors"
import { subject } from "@casl/ability"

export async function getUsersWithTodoCount() {
  const user = await getCurrentUser()
  const permissions = getUserPermissions(user)
  if (!permissions.can("read", "User")) {
    throw new UnauthorizedError()
  }

  const users = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
      role: UserTable.role,
      createdAt: UserTable.createdAt,
      todosCount: count(todo.id),
    })
    .from(UserTable)
    .leftJoin(todo, eq(UserTable.id, todo.userId))
    .groupBy(UserTable.id)
    .orderBy(desc(UserTable.createdAt))

  return users.filter(u => permissions.can("read", subject("User", { ...u })))
}
