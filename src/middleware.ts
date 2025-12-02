import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 1. Ambil token dari cookies browser
    const token = request.cookies.get('session_token')?.value

    // 2. Ambil path yang sedang diakses
    const { pathname } = request.nextUrl

    // Debugging (Opsional: cek di terminal server saat akses)
    // console.log(`[Middleware] Path: ${pathname} | Token: ${!!token}`)

    // DEFINISI ROUTE
    // Route yang dianggap sebagai halaman dashboard (terproteksi)
    // Dalam kasus Anda, "/" adalah dashboard. Kita juga bisa proteksi sub-path lainnya.
    const isDashboardRoute = pathname === '/' || pathname.startsWith('/dashboard')

    // Route khusus auth (login/register)
    const isAuthRoute = pathname === '/login'

    // LOGIKA REDIRECT

    // SKENARIO A: User SUDAH login (ada token), tapi coba akses halaman Login
    // -> Redirect paksa kembali ke Dashboard
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // SKENARIO B: User BELUM login (tidak ada token), tapi coba akses Dashboard
    // -> Redirect paksa ke halaman Login
    if (isDashboardRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Lanjutkan request jika tidak memenuhi kondisi di atas
    return NextResponse.next()
}

// KONFIGURASI MATCHER
// Matcher ini menentukan di route mana saja middleware aktif.
// Pattern ini akan menjalankan middleware di semua route KECUALI:
// - api (API routes)
// - _next/static (file statis Next.js)
// - _next/image (image optimization)
// - favicon.ico (icon)
// Ini LEBIH AMAN daripada mendaftar satu per satu route.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}