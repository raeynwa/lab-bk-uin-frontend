'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ApiResponse, TahunAjaran } from '@/types/master'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

// Helper untuk mengambil header auth
async function getAuthHeaders() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

// 1. GET ALL (Index)
export async function getTahunAjaran(page = 1, search = ''): Promise<ApiResponse<TahunAjaran> | { error: string }> {
    try {
        const headers = await getAuthHeaders()
        const res = await fetch(`${BASE_URL}/auth/tahun-ajaran/index?page=${page}&search=${search}`, {
            method: 'GET',
            headers,
            cache: 'no-store' // Agar data selalu fresh
        })

        if (!res.ok) throw new Error('Gagal mengambil data')
        return await res.json()
    } catch (error) {
        return { error: 'Gagal terhubung ke server' }
    }
}

// 2. STORE (Create)
export async function createTahunAjaran(prevState: any, formData: FormData) {
    const headers = await getAuthHeaders()

    const payload = {
        tahun_ajaran: formData.get('tahun_ajaran'),
        periode_awal: formData.get('periode_awal'),
        periode_akhir: formData.get('periode_akhir'),
        sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
    }

    const res = await fetch(`${BASE_URL}/auth/tahun-ajaran/store`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
        return { error: data.message || 'Gagal menyimpan data' }
    }

    revalidatePath('/master/tahun-ajaran')
    return { success: true, message: 'Data berhasil disimpan' }
}

// 3. UPDATE
export async function updateTahunAjaran(id: string, prevState: any, formData: FormData) {
    const headers = await getAuthHeaders()

    const payload = {
        tahun_ajaran: formData.get('tahun_ajaran'),
        periode_awal: formData.get('periode_awal'),
        periode_akhir: formData.get('periode_akhir'),
        sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
    }

    const res = await fetch(`${BASE_URL}/auth/tahun-ajaran/update/${id}`, {
        method: 'POST', // Biasanya Laravel update pakai PUT/PATCH, tapi kadang POST jika ada method spoofing
        headers,
        body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
        return { error: data.message || 'Gagal memperbarui data' }
    }

    revalidatePath('/master/tahun-ajaran')
    return { success: true, message: 'Data berhasil diperbarui' }
}

// 4. SOFT DELETE
export async function softDeleteTahunAjaran(id: string) {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/auth/tahun-ajaran/soft-delete/${id}`, {
        method: 'DELETE',
        headers
    })

    if (!res.ok) return { error: 'Gagal menghapus data' }

    revalidatePath('/master/tahun-ajaran')
    return { success: true }
}

// 5. HARD DELETE
export async function hardDeleteTahunAjaran(id: string) {
    const headers = await getAuthHeaders()
    const res = await fetch(`${BASE_URL}/auth/tahun-ajaran/hard-delete/${id}`, {
        method: 'DELETE',
        headers
    })

    if (!res.ok) return { error: 'Gagal menghapus permanen' }

    revalidatePath('/master/tahun-ajaran')
    return { success: true }
}