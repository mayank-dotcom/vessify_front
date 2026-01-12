import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
        : "http://localhost:3001/api/auth",
    plugins: [
        organizationClient()
    ]
})

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
    organization,
    useListOrganizations,
    useActiveOrganization
} = authClient
