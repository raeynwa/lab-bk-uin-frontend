export function DashboardFooter() {
    return (
        <footer className="flex items-center justify-center border-t py-4 text-center text-sm text-muted-foreground">
            <p>
                &copy; {new Date().getFullYear()} Dashboard App. Built with Next.js & shadcn/ui.
            </p>
        </footer>
    )
}