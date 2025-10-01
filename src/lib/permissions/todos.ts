import { auth } from "../auth/auth"
import { todo as TodoTable } from "@/drizzle/schema"
import { getUserPermissions } from "./getUserPermissions"
import { subject } from "@casl/ability"

export function canReadTodo({
  user,
  todo,
}: {
  user: typeof auth.$Infer.Session.user | undefined
  todo?: typeof TodoTable.$inferSelect
}) {
  if (todo == null) {
    return getUserPermissions(user).can("read", "Todo")
  }

  return getUserPermissions(user).can("read", subject("Todo", todo))
}

export function canCreateTodo({
  user,
  todo,
}: {
  user: typeof auth.$Infer.Session.user | undefined
  todo?: typeof TodoTable.$inferInsert
}) {
  if (todo == null) {
    return getUserPermissions(user).can("create", "Todo")
  }

  return getUserPermissions(user).can("create", subject("Todo", todo))
}

export function canUpdateTodo({
  user,
  todo,
  data,
}: {
  user: typeof auth.$Infer.Session.user | undefined
  todo?: typeof TodoTable.$inferSelect
  data?: Partial<typeof TodoTable.$inferInsert>
}) {
  if (todo == null) {
    return getUserPermissions(user).can("update", "Todo")
  }

  if (data == null) {
    return getUserPermissions(user).can("update", subject("Todo", todo))
  }

  return Object.keys(data).every(field => {
    return getUserPermissions(user).can("update", subject("Todo", todo), field)
  })
}

export function canDeleteTodo({
  user,
  todo,
}: {
  user: typeof auth.$Infer.Session.user | undefined
  todo?: typeof TodoTable.$inferSelect
}) {
  if (todo == null) {
    return getUserPermissions(user).can("delete", "Todo")
  }

  return getUserPermissions(user).can("delete", subject("Todo", todo))
}

export function canToggleTodo({
  user,
  todo,
}: {
  user: typeof auth.$Infer.Session.user | undefined
  todo?: typeof TodoTable.$inferSelect
}) {
  if (todo == null) {
    return getUserPermissions(user).can("update", "Todo", "complete")
  }

  return getUserPermissions(user).can(
    "update",
    subject("Todo", todo),
    "complete"
  )
}
