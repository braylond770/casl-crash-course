import { getUsersWithTodoCount } from "@/dal/users/queries"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { getUserPermissions } from "@/lib/permissions/getUserPermissions"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const user = await getCurrentUser()
  const permissions = getUserPermissions(user)
  if (!permissions.can("read", "User")) redirect("/")

  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <UsersTable />
      </Suspense>
    </div>
  )
}

export async function UsersTable() {
  const users = await getUsersWithTodoCount()

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No users found
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Todos</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.todosCount}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.createdAt.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
