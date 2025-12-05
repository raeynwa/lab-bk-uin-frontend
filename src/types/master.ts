export interface TahunAjaran {
    id_tahun_ajaran: string
    tahun_ajaran: string
    periode_awal: string
    periode_akhir: string
    sts_aktif: string // "1" | "2"
    sts_hapus: string
    created_by?: string
    updated_by?: string
    created_at?: string
    updated_at?: string
}

// Interface Baru untuk Semester
export interface Semester {
    id_semester: string
    id_tahun_ajaran_fr: string
    semester: string
    periode_awal: string
    periode_akhir: string
    sts_aktif: string
    sts_hapus: string
    created_by?: string
    updated_by?: string
    created_at?: string
    updated_at?: string
    // Field tambahan dari join/relation dengan tahun ajaran
    id_tahun_ajaran?: string
    tahun_ajaran?: string
}

export interface ApiResponse<T> {
    current_page: number
    data: T[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}