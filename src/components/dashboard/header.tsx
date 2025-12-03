import Link from "next/link"
import { CircleUser, Home, Menu, Package2 } from "lucide-react"
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
import { ModeToggle } from "@/components/mode-toggle"
import { logoutAction } from "@/app/actions/auth"

interface DashboardHeaderProps {
    user: {
        nama_user: string;
        email: string;
    }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    return (
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
                        <Link
                            href="/"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                {/* Search bar bisa diletakkan di sini */}
            </div>

            {/* Tombol Ganti Tema */}
            <ModeToggle />

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:block">
                    {user.nama_user}
                </span>
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
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />

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
    )
}