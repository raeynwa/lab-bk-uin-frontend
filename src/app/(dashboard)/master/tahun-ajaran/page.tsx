'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
    Search,
    Plus,
    MoreHorizontal,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Calendar,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Download,
    Trash2,
    Edit,
    Trash,
    Clock,
    Archive,
    RotateCcw
} from "lucide-react"
import { toast } from "sonner"

// Import Server Actions
import {
    getTahunAjaran,
    softDeleteTahunAjaran,
    hardDeleteTahunAjaran,
    restoreTahunAjaran
} from "@/app/actions/tahun-ajaran"
import { TahunAjaranFormDialog } from "@/components/master/tahun-ajaran/form-dialog"
import { TahunAjaran, ApiResponse } from "@/types/master"

export default function TahunAjaranPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // --- STATE DATA & UI ---
    const [data, setData] = useState<TahunAjaran[]>([])
    const [loading, setLoading] = useState(true)
    const [meta, setMeta] = useState<Omit<ApiResponse<TahunAjaran>, 'data'> | null>(null)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedData, setSelectedData] = useState<TahunAjaran | null>(null)

    // State untuk Dialog Aksi (Delete / Restore)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [actionType, setActionType] = useState<'soft' | 'hard' | 'restore'>('soft')
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

    // State Mode Data: 1 = Aktif (Normal), 2 = Terhapus (Trash)
    const [dataMode, setDataMode] = useState<number>(1)

    // URL Params (Hanya dipakai jika mode = 1 / Aktif)
    const urlPage = Number(searchParams.get("page")) || 1
    const search = searchParams.get("search") || ""

    // --- LOGIC FETCH DATA ---
    const fetchData = async () => {
        setLoading(true)
        // Mengirim status (dataMode) sebagai parameter ke-3 ke backend
        const res = await getTahunAjaran(urlPage, search, dataMode)

        if ('error' in res) {
            toast.error(res.error)
        } else {
            setData(res.data)
            const { data, ...rest } = res
            setMeta(rest)
        }
        setLoading(false)
    }

    // Refresh saat page URL, search, atau mode data berubah
    useEffect(() => {
        fetchData()
    }, [urlPage, search, dataMode])

    // --- HANDLERS ---
    const handleSearch = (term: string) => {
        setSearchTerm(term)
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("search", term)
        } else {
            params.delete("search")
        }
        // Reset ke halaman 1 saat search berubah
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const toggleDataMode = () => {
        // Reset halaman ke 1 setiap kali ganti mode
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`)

        if (dataMode === 1) {
            setDataMode(2)
            toast.info("Menampilkan data yang sudah dihapus")
        } else {
            setDataMode(1)
        }
    }

    // --- CONFIRMATION ACTION HANDLER ---
    const confirmAction = async () => {
        if (!selectedId) return

        let res
        let successMessage = ""

        // Eksekusi action berdasarkan tipe
        if (actionType === 'soft') {
            res = await softDeleteTahunAjaran(selectedId)
            successMessage = "Data berhasil dihapus sementara"
        } else if (actionType === 'hard') {
            res = await hardDeleteTahunAjaran(selectedId)
            successMessage = "Data berhasil dihapus permanen"
        } else if (actionType === 'restore') {
            res = await restoreTahunAjaran(selectedId)
            successMessage = "Data berhasil dipulihkan"
        }

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(successMessage)
            fetchData() // Refresh data
        }
        setIsConfirmDialogOpen(false)
    }

    // --- DIALOG HELPERS ---
    const openCreateDialog = () => {
        setSelectedData(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (item: TahunAjaran) => {
        setSelectedData(item)
        setIsDialogOpen(true)
    }

    // Helper generik untuk membuka dialog konfirmasi
    const openConfirmDialog = (id: string, type: 'soft' | 'hard' | 'restore') => {
        setSelectedId(id)
        setActionType(type)
        setIsConfirmDialogOpen(true)
    }

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) fetchData()
    }

    // --- HELPER FORMAT TANGGAL ---
    const formatDateTime = (dateString?: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const StatusBadge = ({ active }: { active: string }) => {
        let styles = "";
        let icon = null;
        let label = "";

        if (active === "1") {
            styles = "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20";
            icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
            label = "Aktif";
        } else {
            styles = "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20";
            icon = <XCircle className="w-3 h-3 mr-1" />;
            label = "Non-Aktif";
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
                {icon}
                {label}
            </span>
        );
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-300 font-sans p-4 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">
                        {dataMode === 1 ? "Master Tahun Ajaran" : "Sampah Tahun Ajaran"}
                    </h1>
                    <p className="text-muted-foreground">
                        {dataMode === 1
                            ? "Kelola data tahun ajaran akademik sekolah."
                            : "Kelola data tahun ajaran yang sudah dihapus sementara."}
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* Tombol Toggle Mode (Updated: Small Size) */}
                    <button
                        onClick={toggleDataMode}
                        className={`flex items-center gap-2 h-8 px-3 rounded-md transition-all text-xs font-medium border border-border
              ${dataMode === 1
                                ? "bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                                : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                    >
                        {dataMode === 1 ? (
                            <>
                                <Archive className="w-3.5 h-3.5" />
                                Data Terhapus
                            </>
                        ) : (
                            <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Data Utama
                            </>
                        )}
                    </button>

                    {/* Tombol Export (Updated: Small Size) */}
                    {/* <button className="hidden sm:flex items-center gap-2 h-8 px-3 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-all text-xs font-medium border border-border">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button> */}

                    {/* Tombol Tambah (Updated: Small Size) */}
                    {dataMode === 1 && (
                        <button
                            onClick={openCreateDialog}
                            className="flex-1 sm:flex-none items-center justify-center gap-2 h-8 px-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 shadow-lg shadow-primary/20 transition-all text-xs font-medium flex"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Tambah Baru
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN CARD */}
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">

                {/* TOOLBAR */}
                <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20">
                    <div className="relative w-full sm:w-72">
                        <div className="absolute left-3 top-2 text-muted-foreground pointer-events-none">
                            <Search className="w-3.5 h-3.5" />
                        </div>
                        {/* Input Search (Updated: Small Size h-8) */}
                        <input
                            type="text"
                            placeholder="Cari tahun ajaran..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full h-8 rounded-md border border-input bg-background !pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Tombol Filter (Updated: Small Size h-8) */}
                        {/* <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-8 px-3 bg-background border border-input rounded-md text-xs font-medium hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button> */}
                        {/* Tombol View (Updated: Small Size h-8) */}
                        {/* <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-8 px-3 bg-background border border-input rounded-md text-xs font-medium hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-3.5 h-3.5" />
                            View
                        </button> */}
                    </div>
                </div>

                {/* TABLE */}
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b border-border">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="shadcn-table-header w-12 text-center">No</th>
                                <th className="shadcn-table-header text-center w-24">Aksi</th>
                                <th className="shadcn-table-header cursor-pointer group hover:text-foreground transition-colors">
                                    <div className="flex items-center gap-1">
                                        Tahun Ajaran
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th className="shadcn-table-header">Periode</th>
                                <th className="shadcn-table-header">Status</th>
                                <th className="shadcn-table-header">Dibuat Oleh</th>
                                <th className="shadcn-table-header">Diupdate Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                                        Tidak ada data {dataMode === 2 ? 'terhapus' : ''} ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id_tahun_ajaran}
                                        className="border-b border-border transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted group"
                                    >
                                        <td className="shadcn-table-cell text-center font-mono text-xs text-muted-foreground">
                                            {dataMode === 1 ? (meta?.from ?? 1) + index : index + 1}
                                        </td>

                                        <td className="shadcn-table-cell text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* MODE AKTIF (1) */}
                                                {dataMode === 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => openEditDialog(item)}
                                                            className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start">
                                                                <DropdownMenuItem
                                                                    onClick={() => openConfirmDialog(item.id_tahun_ajaran, 'soft')}
                                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openConfirmDialog(item.id_tahun_ajaran, 'hard')}
                                                                    className="text-red-900 focus:text-red-900 cursor-pointer"
                                                                >
                                                                    <Trash className="mr-2 h-4 w-4" /> Hapus Permanen
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </>
                                                )}

                                                {/* MODE TERHAPUS (2): Restore & Hard Delete */}
                                                {dataMode === 2 && (
                                                    <>
                                                        {/* Tombol Restore */}
                                                        <button
                                                            onClick={() => openConfirmDialog(item.id_tahun_ajaran, 'restore')}
                                                            className="p-1.5 hover:bg-primary/10 rounded-md text-primary hover:text-primary transition-colors"
                                                            title="Kembalikan Data"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>

                                                        {/* Tombol Hard Delete */}
                                                        <button
                                                            onClick={() => openConfirmDialog(item.id_tahun_ajaran, 'hard')}
                                                            className="p-1.5 hover:bg-destructive/10 rounded-md text-destructive hover:text-destructive transition-colors"
                                                            title="Hapus Permanen"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>

                                        <td className="shadcn-table-cell font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                {item.tahun_ajaran}
                                            </div>
                                        </td>

                                        <td className="shadcn-table-cell text-muted-foreground font-mono text-xs">
                                            {new Date(item.periode_awal).toLocaleDateString("id-ID")} - {new Date(item.periode_akhir).toLocaleDateString("id-ID")}
                                        </td>

                                        <td className="shadcn-table-cell">
                                            <StatusBadge active={item.sts_aktif} />
                                        </td>

                                        <td className="shadcn-table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase border border-indigo-200 dark:border-indigo-800">
                                                        {(item.created_by || "SY").substring(0, 2)}
                                                    </div>
                                                    <span className="text-sm font-medium">{item.created_by || "System"}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-7">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDateTime(item.created_at)}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="shadcn-table-cell">
                                            {item.updated_by ? (
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase border border-orange-200 dark:border-orange-800">
                                                            {item.updated_by.substring(0, 2)}
                                                        </div>
                                                        <span className="text-sm font-medium">{item.updated_by}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-7">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatDateTime(item.updated_at)}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic ml-2">- Belum ada update -</span>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {meta && dataMode === 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/20 gap-4 sm:gap-0">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <span className="font-medium text-foreground">{meta.from || 0}</span> sampai <span className="font-medium text-foreground">{meta.to || 0}</span> dari <span className="font-medium text-foreground">{meta.total}</span> data
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(meta.current_page - 1)}
                                disabled={meta.current_page === 1}
                                className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-1">
                                <button
                                    className="w-8 h-8 rounded-md text-xs font-medium bg-primary text-primary-foreground shadow-sm flex items-center justify-center"
                                >
                                    {meta.current_page}
                                </button>
                            </div>

                            <button
                                onClick={() => handlePageChange(meta.current_page + 1)}
                                disabled={meta.current_page === meta.last_page}
                                className="p-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* MODAL COMPONENTS */}
            <TahunAjaranFormDialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
                dataToEdit={selectedData}
            />

            {/* Dialog Konfirmasi (Delete & Restore) */}
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionType === 'restore'
                                ? "Kembalikan Data?"
                                : "Apakah Anda yakin?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionType === 'soft' && "Data ini akan dihapus sementara dan masuk ke tong sampah."}
                            {actionType === 'hard' && "Tindakan ini tidak bisa dibatalkan. Data akan dihapus secara permanen dari database."}
                            {actionType === 'restore' && "Data akan dikembalikan ke daftar aktif."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmAction}
                            className={actionType === 'restore'
                                ? "bg-primary hover:bg-primary/90"
                                : "bg-red-600 hover:bg-red-700"
                            }
                        >
                            {actionType === 'soft' && 'Hapus'}
                            {actionType === 'hard' && 'Hapus Permanen'}
                            {actionType === 'restore' && 'Pulihkan'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}