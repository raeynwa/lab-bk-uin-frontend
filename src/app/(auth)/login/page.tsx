import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        // Wrapper utama dengan background gradient sesuai request
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4">

            {/* Background Decorator (Gradient) */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,var(--primary)_100%)] opacity-20 dark:opacity-10"></div>

            {/* Form Component */}
            <LoginForm />

        </div>
    )
}