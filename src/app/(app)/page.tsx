import { TodoCheckbox } from "@/components/todo-checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllTodosWithUsers } from "@/dal/todos/queries"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { getUserPermissions } from "@/lib/permissions/getUserPermissions"
import { canToggleTodo } from "@/lib/permissions/todos"
import { cn } from "@/lib/utils"
import { subject } from "@casl/ability"
import { Suspense } from "react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-3xl font-bold mb-6">All Todos</h1>
      <Suspense fallback={<div>Loading todos...</div>}>
        <Todos />
      </Suspense>
    </div>
  )
}

async function Todos() {
  const currentUser = await getCurrentUser()
  const todos = await getAllTodosWithUsers()
  const todosByUser = Object.groupBy(todos, t => t.user.id)

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No todos to display
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(todosByUser).map(([userId, todos]) => {
        if (todos == null || todos.length === 0) return null
        const user = todos[0].user

        return (
          <Card key={userId}>
            <CardHeader>
              <CardTitle className="text-xl">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todos.map(todo => (
                  <div
                    key={todo.id}
                    className={cn(
                      "flex gap-3 items-center",
                      todo.complete && "opacity-60"
                    )}
                  >
                    {canToggleTodo({ user: currentUser, todo }) && (
                      <TodoCheckbox id={todo.id} checked={todo.complete} />
                    )}
                    <span
                      className={cn(
                        todo.complete && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.title}
                    </span>
                    {!todo.public && (
                      <Badge variant="outline" className="text-xs">
                        Private
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
