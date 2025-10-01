import { db } from "@/drizzle/db"
import { todo } from "@/drizzle/schema"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { UnauthenticatedError, UnauthorizedError } from "../errors"
import {
  canCreateTodo,
  canDeleteTodo,
  canUpdateTodo,
} from "@/lib/permissions/todos"

export async function createTodo(
  data: Omit<typeof todo.$inferInsert, "userId">
) {
  const user = await getCurrentUser()
  if (user == null) throw new UnauthenticatedError()

  const newTodoData = { ...data, userId: user.id }
  if (!canCreateTodo({ user, todo: newTodoData })) {
    throw new UnauthorizedError()
  }

  const [newTodo] = await db.insert(todo).values(newTodoData).returning()

  revalidatePath("/my-todos")
  revalidatePath("/")

  return newTodo
}

export async function updateTodo(
  id: string,
  data: Partial<typeof todo.$inferInsert>
) {
  const [user, existingTodo] = await Promise.all([
    getCurrentUser(),
    db.query.todo.findFirst({ where: eq(todo.id, id) }),
  ])

  if (user == null) {
    throw new UnauthenticatedError()
  }

  if (!canUpdateTodo({ user, todo: existingTodo, data })) {
    throw new UnauthorizedError()
  }

  const [updatedTodo] = await db
    .update(todo)
    .set(data)
    .where(eq(todo.id, id))
    .returning()

  revalidatePath("/my-todos")
  revalidatePath("/")

  return updatedTodo
}

export async function deleteTodo(id: string) {
  const [user, existingTodo] = await Promise.all([
    getCurrentUser(),
    db.query.todo.findFirst({ where: eq(todo.id, id) }),
  ])

  if (user == null) {
    throw new UnauthenticatedError()
  }

  if (!canDeleteTodo({ user, todo: existingTodo })) {
    throw new UnauthorizedError()
  }

  await db.delete(todo).where(eq(todo.id, id))

  revalidatePath("/my-todos")
  revalidatePath("/")
}
