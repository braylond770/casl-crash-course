import { todo, user } from "@/drizzle/schema"
import { auth } from "../auth/auth"
import { AbilityBuilder, createMongoAbility, MongoAbility } from "@casl/ability"

type TodoSubject = Pick<typeof todo.$inferSelect, "public" | "userId"> | "Todo"
type UserSubject = Pick<typeof user.$inferSelect, "role"> | "User"

type Permission =
  | ["read" | "create" | "update" | "delete", TodoSubject]
  | ["read", UserSubject]

export function getUserPermissions(
  user: typeof auth.$Infer.Session.user | undefined
) {
  const { build, can: allow } = new AbilityBuilder<MongoAbility<Permission>>(
    createMongoAbility
  )

  allow("read", "Todo", { public: true })

  if (user != null) {
    allow("read", "Todo", { userId: user.id })
    allow("update", "Todo", { userId: user.id })
    allow("create", "Todo", { userId: user.id })
    allow("delete", "Todo", { userId: user.id, public: false })

    if (user.role === "admin") {
      allow("read", "Todo")
      allow("read", "User", { role: "user" })
      allow("update", "Todo", ["complete"], { public: true })
    }
  }

  return build()
}
