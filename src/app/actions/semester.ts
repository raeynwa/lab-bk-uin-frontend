'use server'

import { revalidatePath } from 'next/cache'
import { fetchAPI } from '@/lib/api-service'
import { ApiResponse, Semester } from '@/types/master'

const isRedirectError = (error: any) => {
    return error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')
}

// 1. GET ALL (Index)
export async function getSemester(page = 1, search = '', status = 1): Promise<ApiResponse<Semester> | { error: string }> {
    try {
        const res = await fetchAPI(`/auth/semester/index?page=${page}&search=${search}&status=${status}`, {
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
export async function createSemester(prevState: any, formData: FormData) {
    try {
        const payload = {
            id_tahun_ajaran_fr: formData.get('id_tahun_ajaran_fr'),
            semester: formData.get('semester'),
            periode_awal: formData.get('periode_awal'),
            periode_akhir: formData.get('periode_akhir'),
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        const res = await fetchAPI(`/auth/semester/store`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.message || 'Gagal menyimpan data' }
        }

        revalidatePath('/master/semester')
        return { success: true, message: 'Data berhasil disimpan' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 3. UPDATE
export async function updateSemester(id: string, prevState: any, formData: FormData) {
    try {
        const payload = {
            id_tahun_ajaran_fr: formData.get('id_tahun_ajaran_fr'),
            semester: formData.get('semester'),
            periode_awal: formData.get('periode_awal'),
            periode_akhir: formData.get('periode_akhir'),
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        // Menggunakan POST sesuai route yang Anda berikan untuk update
        const res = await fetchAPI(`/auth/semester/update/${id}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.message || 'Gagal memperbarui data' }
        }

        revalidatePath('/master/semester')
        return { success: true, message: 'Data berhasil diperbarui' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 4. SOFT DELETE
export async function softDeleteSemester(id: string) {
    try {
        // Sesuai prompt: Route::post('soft-delete/{id}')
        const res = await fetchAPI(`/auth/semester/soft-delete/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal menghapus data' }

        revalidatePath('/master/semester')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 5. HARD DELETE
export async function hardDeleteSemester(id: string) {
    try {
        const res = await fetchAPI(`/auth/semester/hard-delete/${id}`, {
            method: 'DELETE'
        })

        if (!res.ok) return { error: 'Gagal menghapus permanen' }

        revalidatePath('/master/semester')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 6. RESTORE
export async function restoreSemester(id: string) {
    try {
        const res = await fetchAPI(`/auth/semester/restore/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal mengembalikan data' }

        revalidatePath('/master/semester')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}