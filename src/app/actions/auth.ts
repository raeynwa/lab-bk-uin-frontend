'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
    // Ambil data dari form dengan name "username" dan "password"
    const username = formData.get('username')
    const password = formData.get('password')

    // Validasi input di sisi server
    if (!username || !password) {
        return { error: 'Username dan password wajib diisi.' }
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        // Request ke Backend Laravel
        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // Mengirim JSON body sesuai permintaan: { username: "...", password: "..." }
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        // Cek respon sukses dari backend
        if (!res.ok || data.status !== 'success') {
            return {
                // Tampilkan pesan dari API atau pesan default
                error: data.message || 'Login gagal. Periksa kredensial Anda.',
            }
        }

        // --- LOGIN SUKSES ---

        // Simpan Token dan User Info ke Cookie
        // Catatan: Di Next.js 15+, cookies() harus di-await
        const cookieStore = await cookies()

        cookieStore.set('session_token', data.authorisation.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 hari
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

    // Redirect ke Dashboard setelah sukses
    redirect('/')
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete('session_token')
    cookieStore.delete('user_info')
    redirect('/login')
}