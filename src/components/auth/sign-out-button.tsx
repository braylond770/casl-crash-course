"use client"

import { authClient } from "@/lib/auth/auth-client"
import { BetterAuthActionButton } from "./better-auth-action-button"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  return (
    <BetterAuthActionButton
      variant="destructive"
      action={() => {
        return authClient.signOut(undefined, {
          onSuccess: () => router.refresh(),
        })
      }}
    >
      Sign Out
    </BetterAuthActionButton>
  )
}
