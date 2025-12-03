"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Perbaikan tipe untuk NextThemesProvider agar kompatibel dengan React terbaru
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}