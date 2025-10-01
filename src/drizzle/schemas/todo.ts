import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"
import { relations } from "drizzle-orm"

export const todo = pgTable("todo", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  public: boolean("public").notNull(),
  complete: boolean("complete").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(user, {
    fields: [todo.userId],
    references: [user.id],
  }),
}))

export const userRelations = relations(user, ({ many }) => ({
  todos: many(todo),
}))
