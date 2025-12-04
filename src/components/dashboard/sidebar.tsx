'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    Package2,
    Home,
    Database,
    Users,
    GraduationCap,
    Brain,
    CalendarDays,
    FileSpreadsheet,
    Settings,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    Activity,
    FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

// Tipe Data User Sederhana
interface User {
    role_level: number;
    nama_user: string;
}

interface SidebarProps {
    user: User;
}

// Definisi Struktur Menu
type MenuItem = {
    title: string;
    href?: string;
    icon?: React.ElementType;
    roles: number[]; // Level user yang boleh melihat menu ini
    submenu?: MenuItem[]; // Untuk menu bertingkat
}

type MenuCategory = {
    category: string;
    items: MenuItem[];
}

export function DashboardSidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const role = user.role_level;

    // Konfigurasi Menu Berdasarkan Gambar
    const MENU_DATA: MenuCategory[] = [
        {
            category: "Dashboard",
            items: [
                { title: "Dashboard", href: "/", icon: Home, roles: [1, 2, 3, 4] },
            ]
        },
        {
            category: "Master",
            items: [
                { title: "Tahun Ajaran", href: "/master/tahun-ajaran", icon: Database, roles: [1, 2] },
                { title: "Semester", href: "/master/semester", icon: Database, roles: [1, 2] },
                { title: "Mahasiswa", href: "/master/mahasiswa", icon: Users, roles: [1, 2] },
            ]
        },
        {
            category: "Peserta Didik",
            items: [
                { title: "Sekolah", href: "/peserta/sekolah", icon: GraduationCap, roles: [1, 2, 3] },
                { title: "Jumlah Peserta Kelas", href: "/peserta/jumlah", icon: Users, roles: [1, 2, 3] },
                { title: "Siswa", href: "/peserta/siswa", icon: Users, roles: [1, 2, 3] },
                { title: "Kelas", href: "/peserta/kelas", icon: Users, roles: [1, 2, 3] },
            ]
        },
        {
            category: "Master Data Psikotest",
            items: [
                {
                    title: "VAK",
                    icon: Brain,
                    roles: [1, 2, 3], // Asumsi level 3 juga bisa lihat master data VAK (sesuai gambar)
                    submenu: [
                        { title: "Result Master", href: "/psikotest/vak/result", roles: [1, 2, 3] },
                        { title: "Soal VAK", href: "/psikotest/vak/soal", roles: [1, 2, 3] },
                    ]
                },
                {
                    title: "RIASEC",
                    icon: Activity,
                    roles: [1, 2, 3],
                    submenu: [
                        { title: "Result Master", href: "/psikotest/riasec/result", roles: [1, 2, 3] },
                        { title: "Soal RIASEC", href: "/psikotest/riasec/soal", roles: [1, 2, 3] },
                    ]
                },
                {
                    title: "MBTI",
                    icon: Brain,
                    roles: [1, 2, 3],
                    submenu: [
                        { title: "Result Master", href: "/psikotest/mbti/result", roles: [1, 2, 3] },
                        { title: "Soal MBTI", href: "/psikotest/mbti/soal", roles: [1, 2, 3] },
                    ]
                },
                {
                    title: "DCM",
                    icon: FileText,
                    roles: [1, 2, 3],
                    submenu: [
                        { title: "Result Master", href: "/psikotest/dcm/result", roles: [1, 2, 3] },
                        { title: "Soal DCM", href: "/psikotest/dcm/soal", roles: [1, 2, 3] },
                    ]
                },
                {
                    title: "Sosiometri",
                    icon: Users,
                    roles: [1, 2, 3],
                    submenu: [
                        { title: "Result Master", href: "/psikotest/sosiometri/result", roles: [1, 2, 3] },
                        { title: "Soal Sosiometri", href: "/psikotest/sosiometri/soal", roles: [1, 2, 3] },
                    ]
                },
            ]
        },
        {
            category: "Penjadwalan & Test",
            items: [
                { title: "Penjadwalan Test", href: "/jadwal", icon: CalendarDays, roles: [1, 2, 3, 4] },
                { title: "Mulai Test", href: "/test/start", icon: ClipboardList, roles: [4] }, // Khusus Siswa
            ]
        },
        {
            category: "Data Test",
            items: [
                { title: "Data VAK", href: "/data-test/vak", icon: FileSpreadsheet, roles: [1, 2, 3, 4] },
                { title: "Data RIASEC", href: "/data-test/riasec", icon: FileSpreadsheet, roles: [1, 2, 3, 4] },
                { title: "Data MBTI", href: "/data-test/mbti", icon: FileSpreadsheet, roles: [1, 2, 3, 4] },
                { title: "Data DCM", href: "/data-test/dcm", icon: FileSpreadsheet, roles: [1, 2, 3, 4] },
                { title: "Data Sosiometri", href: "/data-test/sosiometri", icon: FileSpreadsheet, roles: [1, 2, 3, 4] },
            ]
        },
        {
            category: "Pengaturan Umum",
            items: [
                { title: "Role", href: "/settings/role", icon: Settings, roles: [1, 2] },
                { title: "Users", href: "/settings/users", icon: Users, roles: [1, 2] },
                { title: "Web Service", href: "/settings/web-service", icon: Database, roles: [1] }, // Super Admin Only
                { title: "Logs", href: "/settings/logs", icon: FileText, roles: [1] }, // Super Admin Only
            ]
        }
    ];

    return (
        <div className="hidden border-r bg-muted/40 md:block overflow-y-auto">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-background z-10">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Dashboard App</span>
                    </Link>
                </div>

                <div className="flex-1 py-4">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
                        {MENU_DATA.map((section, index) => {
                            // Filter item berdasarkan role
                            const filteredItems = section.items.filter(item => item.roles.includes(role));

                            // Jika kategori tidak memiliki item yang diizinkan, jangan render kategori ini
                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={index} className="space-y-1">
                                    {/* Judul Kategori (Kecuali Dashboard) */}
                                    {section.category !== "Dashboard" && (
                                        <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            {section.category}
                                        </h4>
                                    )}

                                    {/* Render Items */}
                                    {filteredItems.map((item, i) => (
                                        <SidebarMenuItem key={i} item={item} pathname={pathname} role={role} />
                                    ))}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    )
}

// Komponen Kecil untuk Menangani Menu Item (Single Link atau Submenu)
function SidebarMenuItem({ item, pathname, role }: { item: MenuItem, pathname: string, role: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon || Package2;

    // Cek apakah item ini punya submenu yang valid untuk role ini
    const validSubmenu = item.submenu?.filter(sub => sub.roles.includes(role));
    const hasSubmenu = validSubmenu && validSubmenu.length > 0;

    // Jika tidak punya submenu, render link biasa
    if (!hasSubmenu) {
        if (!item.href) return null;
        const isActive = pathname === item.href;

        return (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
                {item.title}
            </Link>
        );
    }

    // Jika punya submenu, render Collapsible
    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                    isOpen && "text-primary font-medium"
                )}
            >
                <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.title}
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isOpen && (
                <div className="ml-4 space-y-1 border-l pl-2">
                    {validSubmenu?.map((sub, idx) => {
                        const isSubActive = pathname === sub.href;
                        return (
                            <Link
                                key={idx}
                                href={sub.href || "#"}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                                    isSubActive ? "text-primary font-medium bg-muted/50" : "text-muted-foreground"
                                )}
                            >
                                {sub.title}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
}