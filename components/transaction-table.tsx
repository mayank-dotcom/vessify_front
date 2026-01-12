
"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "@/lib/auth"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" // We need to add Badge component
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { apiFetch } from "@/lib/api"
import { Transaction, TransactionResponse } from "@/types"

interface TransactionTableProps {
    refreshTrigger: number
}

export function TransactionTable({ refreshTrigger }: TransactionTableProps) {
    const { data: session, loading } = useSession()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(false)

    const fetchTransactions = useCallback(async (reset = false) => {
        try {
            if (reset) setIsLoading(true)
            else setIsLoadingMore(true)

            const queryParams = new URLSearchParams()
            queryParams.append("limit", "10")
            if (!reset && cursor) {
                queryParams.append("cursor", cursor)
            }

            const response = await apiFetch<TransactionResponse>(`/api/transactions?${queryParams.toString()}`)

            if (response.success) {
                if (reset) {
                    setTransactions(response.transactions)
                } else {
                    setTransactions(prev => [...prev, ...response.transactions])
                }
                setCursor(response.pagination.nextCursor)
                setHasMore(response.pagination.hasMore)
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }, [cursor]) // Be careful with dependencies for fetchTransactions if used in useEffect

    // Initial load and refresh
    useEffect(() => {
        // Only fetch if user is authenticated (not loading and session exists)
        if (loading || !session) {
            setIsLoading(false)
            return
        }

        // Reset cursor when refreshing
        setCursor(null)
        // We need to fetch immediately with null cursor
        const loadInitial = async () => {
            setIsLoading(true)
            try {
                const response = await apiFetch<TransactionResponse>(`/api/transactions?limit=10`)
                if (response.success) {
                    setTransactions(response.transactions)
                    setCursor(response.pagination.nextCursor)
                    setHasMore(response.pagination.hasMore)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        }
        loadInitial()
    }, [refreshTrigger, session, loading])

    const loadMore = async () => {
        if (!cursor) return
        setIsLoadingMore(true)
        try {
            const response = await apiFetch<TransactionResponse>(`/api/transactions?limit=10&cursor=${cursor}`)
            if (response.success) {
                setTransactions(prev => [...prev, ...response.transactions])
                setCursor(response.pagination.nextCursor)
                setHasMore(response.pagination.hasMore)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoadingMore(false)
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No transactions found. Add one above!
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Confidence</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell>{format(new Date(t.date), "MMM d, yyyy")}</TableCell>
                                            <TableCell className="font-medium">{t.description}</TableCell>
                                            <TableCell className={`text-right ${t.amount < 0 ? "text-red-500" : "text-green-500"}`}>
                                                ₹{Math.abs(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.confidence >= 90 ? "bg-green-100 text-green-800" :
                                                    t.confidence >= 70 ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-red-100 text-red-800"
                                                    }`}>
                                                    {t.confidence}%
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {hasMore && (
                            <div className="flex justify-center">
                                <Button variant="outline" onClick={loadMore} disabled={isLoadingMore}>
                                    {isLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Load More
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
