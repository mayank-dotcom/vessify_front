export interface Transaction {
    id: string
    date: string
    description: string
    amount: number
    balance: number | null
    confidence: number
    createdAt: string
}

export interface Organization {
    id: string
    name: string
    slug: string
    role: string
}

export interface User {
    id: string
    name: string
    email: string
    image?: string
}

export interface Pagination {
    hasMore: boolean
    nextCursor: string | null
}

export interface TransactionResponse {
    success: boolean
    transactions: Transaction[]
    pagination: Pagination
}

export interface ExtractResponse {
    success: boolean
    transaction: Transaction
}
