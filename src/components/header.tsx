"use client"

import { authClient } from "@/lib/auth/auth-client"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import Link from "next/link"
import { getUserPermissions } from "@/lib/permissions/getUserPermissions"

export function Header() {
  const { data: session } = authClient.useSession()

  return (
    <header className="w-full border-b bg-background h-16 flex">
      <div className="container m-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex justify-center flex-col">
            <Link href="/" className="text-lg font-semibold">
              CASL Demo
            </Link>
            {session?.user && (
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session?.user && (
              <Button variant="link" asChild className="-mx-3">
                <Link href="/my-todos">My Todos</Link>
              </Button>
            )}
            {getUserPermissions(session?.user).can("read", "User") && (
              <Button variant="link" asChild className="-mx-3">
                <Link href="/users">Users</Link>
              </Button>
            )}
            {session?.user ? (
              <SignOutButton />
            ) : (
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
