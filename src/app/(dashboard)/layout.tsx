import { cookies } from 'next/headers'
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardFooter } from "@/components/dashboard/footer"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Ambil data session
    const cookieStore = await cookies()
    const userInfoCookie = cookieStore.get('user_info')

    // Default user jika cookie kosong (untuk mencegah error)
    let user = {
        id_user: '',
        nama_user: 'Guest',
        email: '',
        role_level: 0, // Default 0 (tidak punya akses menu)
        role_name: 'Guest'
    }

    try {
        if (userInfoCookie) {
            user = JSON.parse(userInfoCookie.value)
        }
    } catch (e) {
        console.error("Error parsing user cookie", e)
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

            {/* 2. UPDATE: Oper data user ke Sidebar agar menu dinamis */}
            <DashboardSidebar user={user} />

            <div className="flex flex-col h-full max-h-screen overflow-hidden">

                {/* 3. Panggil Komponen Header (oper data user) */}
                <DashboardHeader user={user} />

                {/* 4. Area Konten Utama (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/20">
                    {children}
                </main>

                {/* 5. Panggil Komponen Footer */}
                <DashboardFooter />

            </div>
        </div>
    )
}