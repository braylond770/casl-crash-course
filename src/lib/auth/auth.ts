import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/drizzle/db"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
  appName: "Casl Demo",
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: {
        type: "string" as unknown as ["user", "admin"],
        required: true,
        defaultValue: "user",
        input: false,
      },
    },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, { provider: "pg" }),
})
