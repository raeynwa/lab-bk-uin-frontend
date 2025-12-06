'use server'

import { revalidatePath } from 'next/cache'
import { fetchAPI } from '@/lib/api-service'
import { ApiResponse, Mahasiswa } from '@/types/master'

const isRedirectError = (error: any) => {
    return error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')
}

// 1. GET ALL
export async function getMahasiswa(page = 1, search = '', status = 1): Promise<ApiResponse<Mahasiswa> | { error: string }> {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/index?page=${page}&search=${search}&status=${status}`, {
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

// 2. STORE (Create)
export async function createMahasiswa(prevState: any, formData: FormData) {
    try {
        // UPDATE: Sesuaikan key payload dengan Backend Laravel
        const payload = {
            nim: formData.get('nim'),
            nama_mahasiswa: formData.get('nama_mahasiswa'), // Backend butuh 'nama_mahasiswa'
            email: formData.get('email'),
            phone_number: formData.get('phone_number'), // Backend butuh 'phone_number'
            jenis_kelamin: formData.get('jenis_kelamin'), // Backend butuh 'jenis_kelamin'
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        const res = await fetchAPI(`/auth/mahasiswa/store`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            // Menangkap error validasi dari Laravel (misal: "The nama mahasiswa field is required")
            return { error: data.message || 'Gagal menyimpan data' }
        }

        revalidatePath('/master/mahasiswa')
        return { success: true, message: 'Data berhasil disimpan' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 3. UPDATE
export async function updateMahasiswa(id: string, prevState: any, formData: FormData) {
    try {
        const payload = {
            nim: formData.get('nim'),
            nama_mahasiswa: formData.get('nama_mahasiswa'),
            email: formData.get('email'),
            phone_number: formData.get('phone_number'),
            jenis_kelamin: formData.get('jenis_kelamin'),
            sts_aktif: formData.get('sts_aktif') === 'on' ? '1' : '2'
        }

        const res = await fetchAPI(`/auth/mahasiswa/update/${id}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.message || 'Gagal memperbarui data' }
        }

        revalidatePath('/master/mahasiswa')
        return { success: true, message: 'Data berhasil diperbarui' }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 4. SOFT DELETE
export async function softDeleteMahasiswa(id: string) {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/soft-delete/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal menghapus data' }

        revalidatePath('/master/mahasiswa')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 5. HARD DELETE
export async function hardDeleteMahasiswa(id: string) {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/hard-delete/${id}`, {
            method: 'DELETE'
        })

        if (!res.ok) return { error: 'Gagal menghapus permanen' }

        revalidatePath('/master/mahasiswa')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

// 6. RESTORE
export async function restoreMahasiswa(id: string) {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/restore/${id}`, {
            method: 'POST'
        })

        if (!res.ok) return { error: 'Gagal mengembalikan data' }

        revalidatePath('/master/mahasiswa')
        return { success: true }

    } catch (error: any) {
        if (isRedirectError(error)) throw error;
        return { error: 'Terjadi kesalahan sistem' }
    }
}

export async function checkExistingNims(nims: string[]) {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/check-nims`, {
            method: 'POST',
            body: JSON.stringify({ nims })
        })

        if (!res.ok) return { existing_nims: [] }
        return await res.json() // returns { existing_nims: [...] }
    } catch (error) {
        return { existing_nims: [] }
    }
}

// 2. Eksekusi Import Batch
export async function importMahasiswaBatch(data: any[]) {
    try {
        const res = await fetchAPI(`/auth/mahasiswa/import-excel`, {
            method: 'POST',
            body: JSON.stringify({ data })
        })

        const responseData = await res.json()

        if (!res.ok) {
            return { error: responseData.message || 'Gagal import data' }
        }

        revalidatePath('/master/mahasiswa')
        return {
            success: true,
            message: responseData.message,
            count: responseData.success_count,
            errors: responseData.errors
        }

    } catch (error: any) {
        return { error: 'Terjadi kesalahan sistem saat import' }
    }
}