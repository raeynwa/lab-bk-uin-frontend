"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Pastikan komponen sudah di-mount di client untuk menghindari hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Logika yang sama persis dengan halaman login
    const isDark = theme === 'dark'

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    // Tampilkan placeholder atau null saat loading (SSR)
    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost" // Menggunakan ghost agar menyatu dengan navbar, atau ganti 'outline' jika ingin bergaris
            size="icon"
            onClick={toggleTheme}
            className="rounded-full" // Membuat tombol bulat seperti di login
        >
            {isDark ? (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
            ) : (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}