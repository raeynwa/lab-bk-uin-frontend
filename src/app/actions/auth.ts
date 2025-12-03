'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
    const username = formData.get('username')
    const password = formData.get('password')

    if (!username || !password) {
        return { error: 'Username dan password wajib diisi.' }
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        if (!res.ok || data.status !== 'success') {
            return {
                error: data.message || 'Login gagal. Periksa kredensial Anda.',
            }
        }

        // --- LOGIN SUKSES ---
        const cookieStore = await cookies()

        cookieStore.set('session_token', data.authorisation.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        })

        cookieStore.set('user_info', JSON.stringify(data.user), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        })

    } catch (err) {
        console.error('Login error:', err)
        return {
            error: 'Terjadi kesalahan koneksi ke server.',
        }
    }

    // UPDATE: Redirect dengan parameter success
    redirect('/?status=login_success')
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session_token')
    cookieStore.delete('user_info')

    // UPDATE: Redirect ke login dengan parameter success
    redirect('/login?status=logout_success')
}