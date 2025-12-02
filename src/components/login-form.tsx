'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from '@/app/actions/auth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "Memproses..." : "Masuk"}
        </Button>
    )
}

export function LoginForm() {
    const [state, action] = useActionState(loginAction, undefined)

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Masuk menggunakan Username, Email, atau No. Telepon.
                </CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username / Email / No. HP</Label>
                        {/* Ubah type jadi text dan name jadi username */}
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="superadmin@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm font-medium text-red-500 text-center">
                            {state.error}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>
    )
}