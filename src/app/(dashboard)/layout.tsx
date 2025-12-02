import { cookies } from 'next/headers'
import Link from "next/link"
import { Package2, CircleUser, Home, Menu, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logoutAction } from '@/app/actions/auth'

// Pastikan menggunakan 'async' karena cookies() bersifat asynchronous di Next.js terbaru
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Gunakan 'await' saat memanggil cookies()
    const cookieStore = await cookies()
    const userInfoCookie = cookieStore.get('user_info')

    // Parsing JSON user info (fallback ke default jika kosong/error)
    let user = { nama_user: 'Guest', email: '' }
    try {
        if (userInfoCookie) {
            user = JSON.parse(userInfoCookie.value)
        }
    } catch (e) {
        console.error("Error parsing user cookie", e)
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* --- SIDEBAR DESKTOP --- */}
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">Dashboard App</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                href="/"
                                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                            >
                                <Home className="h-4 w-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="#"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            >
                                <Users className="h-4 w-4" />
                                Users
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* --- KONTEN UTAMA --- */}
            <div className="flex flex-col">
                {/* HEADER / NAVBAR */}
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">

                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                                    <Package2 className="h-6 w-6" />
                                    <span className="sr-only">Dashboard App</span>
                                </Link>
                                <Link href="/" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <div className="w-full flex-1">
                        {/* Space kosong di tengah navbar */}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium hidden md:block">{user.nama_user}</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">Toggle user menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* LOGOUT BUTTON (Server Action) */}
                                <form action={logoutAction}>
                                    <button className="w-full text-left cursor-default">
                                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                            Logout
                                        </DropdownMenuItem>
                                    </button>
                                </form>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}