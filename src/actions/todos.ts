"use server"

import { createTodo, updateTodo, deleteTodo } from "@/dal/todos/mutations"
import { todoFormSchema } from "./schemas/todos"
import z from "zod"
import { todo } from "@/drizzle/schema"
import { UnauthenticatedError, UnauthorizedError } from "@/dal/errors"
import { redirect } from "next/navigation"

export async function addTodoAction(
  data: z.infer<typeof todoFormSchema>
): Promise<
  | { error: false; todo: typeof todo.$inferSelect }
  | { error: true; message: string }
> {
  const validationResult = todoFormSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      error: true,
      message: "Invalid data",
    }
  }

  try {
    const todo = await createTodo(validationResult.data)
    return { error: false, todo }
  } catch (e) {
    if (e instanceof UnauthenticatedError) return redirect("/auth/login")
    if (e instanceof UnauthorizedError) {
      return {
        error: true,
        message: "You do not have permission to do this",
      }
    }

    return {
      error: true,
      message: "Could not create todo",
    }
  }
}

export async function editTodoAction(
  id: string,
  data: z.infer<typeof todoFormSchema>
): Promise<
  | { error: false; todo: typeof todo.$inferSelect }
  | { error: true; message: string }
> {
  const validationResult = todoFormSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      error: true,
      message: "Invalid data",
    }
  }

  try {
    const todo = await updateTodo(id, validationResult.data)
    return { error: false, todo }
  } catch (e) {
    if (e instanceof UnauthenticatedError) return redirect("/auth/login")
    if (e instanceof UnauthorizedError) {
      return {
        error: true,
        message: "You do not have permission to do this",
      }
    }

    return {
      error: true,
      message: "Could not update todo",
    }
  }
}

export async function deleteTodoAction(id: string) {
  try {
    await deleteTodo(id)
    return { error: false }
  } catch (e) {
    if (e instanceof UnauthenticatedError) return redirect("/auth/login")
    if (e instanceof UnauthorizedError) {
      return {
        error: true,
        message: "You do not have permission to do this",
      }
    }

    return {
      error: true,
      message: "Could not delete todo",
    }
  }
}

export async function toggleTodoAction(id: string, completed: boolean) {
  try {
    await updateTodo(id, { complete: completed })
    return { error: false }
  } catch (e) {
    if (e instanceof UnauthenticatedError) return redirect("/auth/login")
    if (e instanceof UnauthorizedError) {
      return {
        error: true,
        message: "You do not have permission to do this",
      }
    }

    return {
      error: true,
      message: "Could not delete todo",
    }
  }
}
