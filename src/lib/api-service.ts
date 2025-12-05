'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

// Fungsi Internal: Handle Kick User
async function handleUnauthorized() {
    const cookieStore = await cookies()

    // Hapus semua jejak login
    cookieStore.delete('session_token')
    cookieStore.delete('user_info')

    // Tendang ke login
    redirect('/login?status=session_expired')
}

// --- FUNGSI UTAMA: GLOBAL FETCH WRAPPER ---
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    // 1. Setup Headers Otomatis
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    // Jika ada token, inject Bearer Token
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    // 2. Gabungkan config bawaan dengan options tambahan
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    }

    // 3. Eksekusi Fetch ke URL Absolut
    // Endpoint cukup dikirim "/auth/..." saja, BASE_URL otomatis ditambahkan
    const res = await fetch(`${BASE_URL}${endpoint}`, config)

    // 4. GLOBAL INTERCEPTOR: Cek 401 Unauthorized
    if (res.status === 401) {
        await handleUnauthorized()
    }

    return res
}