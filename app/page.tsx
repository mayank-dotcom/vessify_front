
"use client"

import { useState } from "react"
import { useSession, useActiveOrganization } from "@/lib/auth-client"
import { TransactionParser } from "@/components/transaction-parser"
import { TransactionTable } from "@/components/transaction-table"
import { UserNav } from "@/components/user-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CreditCard, User } from "lucide-react"

export default function Dashboard() {
  const { data: session } = useSession()
  const { data: activeOrg } = useActiveOrganization()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Function to trigger table refresh after parsing
  const handleTransactionExtracted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <CreditCard className="h-6 w-6" />
            <span>Transaction Parser</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{session?.user?.name || "User"}</div>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organization</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrg?.name || "No Organization"}</div>
              <p className="text-xs text-muted-foreground">{activeOrg?.slug || "Create one to get started"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
          <div className="col-span-3">
            <TransactionParser onTransactionExtracted={handleTransactionExtracted} />
          </div>
          <div className="col-span-4">
            <TransactionTable refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
