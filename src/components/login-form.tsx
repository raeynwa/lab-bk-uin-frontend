'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTheme } from "next-themes"
import { Eye, EyeOff, Loader2, Lock, User, AlertCircle, Moon, Sun, Smartphone, Mail } from 'lucide-react'

import { loginAction } from '@/app/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

// Helper Component untuk Tombol Submit dengan Loading State
function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            className="w-full bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            type="submit"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                </>
            ) : (
                "Masuk"
            )}
        </Button>
    )
}

export function LoginForm() {
    // Integrasi Server Action
    const [state, action] = useActionState(loginAction, undefined)

    // State Lokal untuk UI
    const [showPassword, setShowPassword] = useState(false)
    const [identityInput, setIdentityInput] = useState('')

    // Theme Hook
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark')
    }

    // Helper untuk menentukan icon input berdasarkan ketikan user
    const getIdentityIcon = () => {
        if (identityInput.match(/^[0-9+]+$/)) return <Smartphone className="w-4 h-4 text-muted-foreground" />
        if (identityInput.includes('@')) return <Mail className="w-4 h-4 text-muted-foreground" />
        return <User className="w-4 h-4 text-muted-foreground" />
    }

    return (
        <div className="w-full max-w-md relative z-10">

            {/* Theme Toggle Button (Floating) */}
            <button
                onClick={toggleTheme}
                type="button"
                className="absolute -top-12 right-0 p-2 rounded-full border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                aria-label="Toggle theme"
            >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <Card className="border-border shadow-xl overflow-hidden">
                <CardHeader className="space-y-1.5 p-6 text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-semibold tracking-tight text-2xl">Selamat Datang</CardTitle>
                    <CardDescription>
                        Masukkan identitas Anda untuk melanjutkan akses ke dashboard.
                    </CardDescription>
                </CardHeader>

                <form action={action}>
                    <CardContent className="grid gap-4 p-6 pt-0">

                        {/* Alert Error */}
                        {state?.error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4" />
                                {state.error}
                            </div>
                        )}

                        {/* Input Identitas */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Email / Username / No. HP</Label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 h-4 w-4 flex items-center justify-center pointer-events-none">
                                    {getIdentityIcon()}
                                </div>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="nama@email.com atau 0812..."
                                    required
                                    className="pl-10" // Padding kiri untuk icon
                                    value={identityInput}
                                    onChange={(e) => setIdentityInput(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Input Password */}
                        <div className="space-y-2">
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 h-4 w-4 flex items-center justify-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="pl-10 pr-10" // Padding kiri icon & kanan toggle
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 p-6 pt-0">
                        <SubmitButton />

                        <div className="text-center text-xs text-muted-foreground">
                            <a href="#" className="underline underline-offset-4 hover:text-primary">
                                Lupa Password
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <div className="text-center mt-6 text-xs text-muted-foreground/60">
                <p>© 2025 Perusahaan Anda. Hak cipta dilindungi.</p>
            </div>
        </div>
    )
}