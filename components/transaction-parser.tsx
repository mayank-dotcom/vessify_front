"use-back"
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { ExtractResponse } from "@/types"
import { organization } from "@/lib/auth-client"

interface TransactionParserProps {
    onTransactionExtracted: () => void
}

export function TransactionParser({ onTransactionExtracted }: TransactionParserProps) {
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { data: activeOrg } = organization.useActiveOrganization()

    async function handleParse() {
        if (!text.trim()) {
            toast.error("Please enter transaction text")
            return
        }

        setIsLoading(true)

        try {
            const headers: Record<string, string> = {}
            if (activeOrg?.id) {
                headers["X-Organization-Id"] = activeOrg.id
            }

            const response = await apiFetch<ExtractResponse>("/api/transactions/extract", {
                method: "POST",
                headers,
                body: JSON.stringify({ text }),
            })

            if (response.success) {
                toast.success("Transaction parsed and saved successfully")
                setText("")
                onTransactionExtracted()
            }
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Failed to parse transaction")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>
                    Paste raw transaction text from bank SMS or statements.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="e.g. Uber Ride * Airport Drop 12/11/2025 -> ₹1,250.00 debited"
                    className="min-h-[120px]"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </CardContent>
            <CardFooter>
                <Button onClick={handleParse} disabled={isLoading || !text.trim()}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Parse & Save
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </CardFooter>
        </Card>
    )
}
