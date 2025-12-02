export default function DashboardPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard Overview</h1>
            </div>

            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm min-h-[400px]">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Selamat Datang!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Anda telah berhasil login dan terhubung dengan API Laravel.
                    </p>
                </div>
            </div>
        </>
    )
}