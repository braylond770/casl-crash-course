import { redirect } from "next/navigation"
import { getUserTodos } from "@/dal/todos/queries"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { TodoModal } from "@/components/todo-modal"
import { Button } from "@/components/ui/button"
import { ActionButton } from "@/components/ui/action-button"
import { TodoCheckbox } from "@/components/todo-checkbox"
import { deleteTodoAction } from "@/actions/todos"
import { Pencil, Trash2 } from "lucide-react"
import {
  canCreateTodo,
  canDeleteTodo,
  canToggleTodo,
  canUpdateTodo,
} from "@/lib/permissions/todos"

export default async function MyTodosPage() {
  const user = await getCurrentUser()
  if (user == null) return redirect("/auth/login")

  const todos = await getUserTodos()

  return (
    <div className="container mx-auto px-4 my-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Todos</h1>
        {canCreateTodo({ user }) && (
          <TodoModal trigger={<Button variant="outline">Add Todo</Button>} />
        )}
      </div>
      {todos.length === 0 ? (
        <p className="text-muted-foreground">You do not have any todos yet.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map(todo => (
            <li
              key={todo.id}
              className={cn(
                "border rounded-lg p-4 shadow-sm bg-card",
                todo.complete && "opacity-60"
              )}
            >
              <div className="flex items-center gap-3">
                {canToggleTodo({ user, todo }) && (
                  <TodoCheckbox id={todo.id} checked={todo.complete} />
                )}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "text-lg font-medium",
                      todo.complete && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={todo.public ? "default" : "outline"}>
                      {todo.public ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canUpdateTodo({ user, todo }) && (
                    <TodoModal
                      todo={{ ...todo }}
                      trigger={
                        <Button variant="outline" size="icon">
                          <Pencil />
                        </Button>
                      }
                    />
                  )}
                  {canDeleteTodo({ user, todo }) && (
                    <ActionButton
                      action={deleteTodoAction.bind(null, todo.id)}
                      requireAreYouSure
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 />
                    </ActionButton>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
