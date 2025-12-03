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

            {/* 2. Panggil Komponen Sidebar */}
            <DashboardSidebar />

            <div className="flex flex-col h-full max-h-screen overflow-hidden">

                {/* 3. Panggil Komponen Header (oper data user) */}
                <DashboardHeader user={user} />

                {/* 4. Area Konten Utama (Scrollable) */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>

                {/* 5. Panggil Komponen Footer */}
                <DashboardFooter />

            </div>
        </div>
    )
}