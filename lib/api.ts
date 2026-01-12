const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

type RequestOptions = RequestInit & {
    headers?: Record<string, string>
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Try to clean up URL
    const url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    // Add Authorization header if token exists
    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Keep for compatibility
    })

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error("Server returned non-JSON response. Please check if the API is running correctly.")
    }

    const data = await response.json()

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized - redirect to login if not already there
            if (!endpoint.includes('/auth/')) {
                // Could trigger logout or redirect here
                // signOut() 
            }
        }
        throw new Error(data.error || data.message || "API request failed")
    }

    return data
}
