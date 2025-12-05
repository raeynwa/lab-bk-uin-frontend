'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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

    // Konfigurasi Menu
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
                    roles: [1, 2, 3],
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
                { title: "Mulai Test", href: "/test/start", icon: ClipboardList, roles: [4] },
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
                { title: "Web Service", href: "/settings/web-service", icon: Database, roles: [1] },
                { title: "Logs", href: "/settings/logs", icon: FileText, roles: [1] },
            ]
        }
    ];

    return (
        // Update: Menggunakan bg-sidebar dan border-sidebar-border
        <div className="hidden border-r border-sidebar-border bg-sidebar md:block overflow-y-auto">
            <div className="flex h-full max-h-screen flex-col gap-2">
                {/* Header Sidebar */}
                <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-sidebar z-10 text-sidebar-foreground">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Dashboard App</span>
                    </Link>
                </div>

                <div className="flex-1 py-4">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-4">
                        {MENU_DATA.map((section, index) => {
                            const filteredItems = section.items.filter(item => item.roles.includes(role));
                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={index} className="space-y-1">
                                    {section.category !== "Dashboard" && (
                                        <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70">
                                            {section.category}
                                        </h4>
                                    )}

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

function SidebarMenuItem({ item, pathname, role }: { item: MenuItem, pathname: string, role: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const Icon = item.icon || Package2;

    const validSubmenu = item.submenu?.filter(sub => sub.roles.includes(role));
    const hasSubmenu = validSubmenu && validSubmenu.length > 0;

    // Auto expand jika salah satu submenu aktif
    useEffect(() => {
        if (hasSubmenu) {
            const isSubActive = validSubmenu.some(sub => pathname === sub.href);
            if (isSubActive) setIsOpen(true);
        }
    }, [pathname, hasSubmenu, validSubmenu]);

    if (!hasSubmenu) {
        if (!item.href) return null;
        const isActive = pathname === item.href;

        return (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-all outline-none ring-sidebar-ring focus-visible:ring-2",
                    isActive
                        // STYLE AKTIF BARU: Background Primary Sidebar & Text Primary Foreground
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary/90"
                        // STYLE NON-AKTIF: Text Sidebar Foreground & Hover Accent
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
            >
                <Icon className="h-4 w-4" />
                {item.title}
            </Link>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-all outline-none ring-sidebar-ring focus-visible:ring-2",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isOpen && "font-medium"
                )}
            >
                <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.title}
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isOpen && (
                <div className="ml-4 space-y-1 border-l border-sidebar-border pl-2">
                    {validSubmenu?.map((sub, idx) => {
                        const isSubActive = pathname === sub.href;
                        return (
                            <Link
                                key={idx}
                                href={sub.href || "#"}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all outline-none ring-sidebar-ring focus-visible:ring-2",
                                    isSubActive
                                        // STYLE SUBMENU AKTIF: Accent Background
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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