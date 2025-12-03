import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        // Tambahkan class "dark" di sini untuk memaksa tema gelap pada halaman login
        // Tambahkan bg-background agar warna background hitam ter-apply dan text-foreground agar teks terbaca
        <div className="dark">
            <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 text-foreground">
                <LoginForm />
            </div>
        </div>
    )
}