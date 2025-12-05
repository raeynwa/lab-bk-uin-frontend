'use server'

import { revalidatePath } from 'next/cache'
import { fetchAPI } from '@/lib/api-service'
import { ApiResponse, TahunAjaran } from '@/types/master'

const isRedirectError = (error: any) => {
    return error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')
}

// 1. GET ALL
export async function getTahunAjaran(page = 1, search = '', status = 1): Promise<ApiResponse<TahunAjaran> | { error: string }> {
    try {
        const res = await fetchAPI(`/auth/tahun-ajaran/index?page=${page}&search=${search}&status=${status}`, {
            method: 'GET',
            cache: 'no-store'
        })

        if (!res.ok) throw new Error('Gagal mengambil data')
        return await res.json()

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Gagal terhubung ke server' }
    }
}

// 2. STORE
export async function createTahunAjaran(prevState: any, formData: FormData) {
    try {
        const payload = {
            tahun_ajaran: formData.get('tahun_ajaran'),
            periode_awal: formData.get('periode_awal'),
            periode_akhir: formData.get('periode_akhir'),
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        const res = await fetchAPI(`/auth/tahun-ajaran/store`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.message || 'Gagal menyimpan data' }
        }

        revalidatePath('/master/tahun-ajaran')
        return { success: true, message: 'Data berhasil disimpan' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 3. UPDATE
export async function updateTahunAjaran(id: string, prevState: any, formData: FormData) {
    try {
        const payload = {
            tahun_ajaran: formData.get('tahun_ajaran'),
            periode_awal: formData.get('periode_awal'),
            periode_akhir: formData.get('periode_akhir'),
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        const res = await fetchAPI(`/auth/tahun-ajaran/update/${id}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.message || 'Gagal memperbarui data' }
        }

        revalidatePath('/master/tahun-ajaran')
        return { success: true, message: 'Data berhasil diperbarui' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 4. SOFT DELETE
export async function softDeleteTahunAjaran(id: string) {
    try {
        const res = await fetchAPI(`/auth/tahun-ajaran/soft-delete/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal menghapus data' }

        revalidatePath('/master/tahun-ajaran')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 5. HARD DELETE
export async function hardDeleteTahunAjaran(id: string) {
    try {
        const res = await fetchAPI(`/auth/tahun-ajaran/hard-delete/${id}`, {
            method: 'DELETE'
        })

        if (!res.ok) return { error: 'Gagal menghapus permanen' }

        revalidatePath('/master/tahun-ajaran')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 6. RESTORE (Fungsi Baru)
export async function restoreTahunAjaran(id: string) {
    try {
        const res = await fetchAPI(`/auth/tahun-ajaran/restore/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal mengembalikan data' }

        revalidatePath('/master/tahun-ajaran')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}