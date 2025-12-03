"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export function AuthToastListener() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const status = searchParams.get("status")

        if (status) {
            // Gunakan setTimeout agar toast tereksekusi di siklus event loop berikutnya
            // Ini mencegah race condition dengan router.replace
            setTimeout(() => {
                if (status === "login_success") {
                    toast.success("Berhasil Masuk", {
                        description: "Selamat datang kembali di Dashboard!",
                    })
                }

                if (status === "logout_success") {
                    toast.success("Berhasil Keluar", {
                        description: "Anda telah logout dari sistem.",
                    })
                }

                // Bersihkan URL query param
                const params = new URLSearchParams(searchParams.toString())
                params.delete("status")

                // Jika sisa parameter kosong, gunakan pathname saja
                const newPath = params.toString() ? `${pathname}?${params.toString()}` : pathname
                router.replace(newPath)
            }, 0)
        }
    }, [searchParams, router, pathname])

    return null
}