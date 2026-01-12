// Token-based auth client (no cookies, works cross-origin)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface User {
    id: string
    email: string
    name: string | null
    emailVerified: boolean
    image: string | null
    createdAt: string
    updatedAt: string
}

interface AuthResponse {
    user: User
    token: string
    session: {
        id: string
        expiresAt: string
    }
}

interface SessionResponse {
    user: User
    session: {
        id: string
        expiresAt: string
    }
}

// Token storage
const TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
}

// Sign in
export async function signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sign in failed')
    }

    const data: AuthResponse = await response.json()
    setToken(data.token)
    return data
}

// Sign up
export async function signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sign up failed')
    }

    const data: AuthResponse = await response.json()
    setToken(data.token)
    return data
}

// Get session
export async function getSession(): Promise<SessionResponse | null> {
    const token = getToken()
    if (!token) return null

    try {
        const response = await fetch(`${API_URL}/api/auth/session`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            removeToken()
            return null
        }

        return await response.json()
    } catch (error) {
        removeToken()
        return null
    }
}

// Sign out
export async function signOut(): Promise<void> {
    const token = getToken()
    if (token) {
        try {
            await fetch(`${API_URL}/api/auth/signout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }
    removeToken()
}

// Hook for using session in components
export function useSession() {
    const [session, setSession] = React.useState<SessionResponse | null>(null)
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        getSession().then(data => {
            setSession(data)
            setLoading(false)
        })
    }, [])

    return { data: session, loading }
}

// React import for the hook
import React from 'react'
