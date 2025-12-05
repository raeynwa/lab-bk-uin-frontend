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
    Search, Plus, MoreHorizontal, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Calendar, CheckCircle2, XCircle, MoreVertical, Download, Trash2, Edit, Trash, Clock, Archive, RotateCcw
} from "lucide-react"
import { toast } from "sonner"

import {
    getSemester,
    softDeleteSemester,
    hardDeleteSemester,
    restoreSemester
} from "@/app/actions/semester"
import { SemesterFormDialog } from "@/components/master/semester/form-dialog"
import { Semester, ApiResponse } from "@/types/master"

export default function SemesterPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [data, setData] = useState<Semester[]>([])
    const [loading, setLoading] = useState(true)
    const [meta, setMeta] = useState<Omit<ApiResponse<Semester>, 'data'> | null>(null)

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedData, setSelectedData] = useState<Semester | null>(null)

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [actionType, setActionType] = useState<'soft' | 'hard' | 'restore'>('soft')
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

    // State Mode Data: 1 = Aktif, 2 = Terhapus
    const [dataMode, setDataMode] = useState<number>(1)

    const urlPage = Number(searchParams.get("page")) || 1
    const search = searchParams.get("search") || ""

    const fetchData = async () => {
        setLoading(true)

        // PERBAIKAN: Pastikan status yang dikirim adalah integer 1 atau 2
        // Parameter: (page, search, status)
        const statusParam = dataMode === 2 ? 2 : 1;

        const res = await getSemester(urlPage, search, statusParam)

        if ('error' in res) {
            toast.error(res.error)
        } else {
            setData(res.data)
            const { data, ...rest } = res
            setMeta(rest)
        }
        setLoading(false)
    }

    // Refresh data saat parameter berubah
    useEffect(() => {
        fetchData()
    }, [urlPage, search, dataMode])

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        const params = new URLSearchParams(searchParams)
        if (term) params.set("search", term)
        else params.delete("search")
        params.set("page", "1")
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const toggleDataMode = () => {
        const params = new URLSearchParams(searchParams)
        params.set("page", "1") // Reset ke halaman 1 saat ganti mode
        router.replace(`${pathname}?${params.toString()}`)

        if (dataMode === 1) {
            setDataMode(2)
            toast.info("Menampilkan data yang sudah dihapus")
        } else {
            setDataMode(1)
        }
    }

    const confirmAction = async () => {
        if (!selectedId) return

        let res
        let successMessage = ""

        if (actionType === 'soft') {
            res = await softDeleteSemester(selectedId)
            successMessage = "Data berhasil dihapus sementara"
        } else if (actionType === 'hard') {
            res = await hardDeleteSemester(selectedId)
            successMessage = "Data berhasil dihapus permanen"
        } else if (actionType === 'restore') {
            res = await restoreSemester(selectedId)
            successMessage = "Data berhasil dipulihkan"
        }

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(successMessage)
            fetchData()
        }
        setIsConfirmDialogOpen(false)
    }

    const openCreateDialog = () => {
        setSelectedData(null)
        setIsDialogOpen(true)
    }

    const openEditDialog = (item: Semester) => {
        setSelectedData(item)
        setIsDialogOpen(true)
    }

    const openConfirmDialog = (id: string, type: 'soft' | 'hard' | 'restore') => {
        setSelectedId(id)
        setActionType(type)
        setIsConfirmDialogOpen(true)
    }

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) fetchData()
    }

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

    const getSemesterLabel = (sem: string) => {
        switch (sem) {
            case '1': return 'Semester Ganjil';
            case '2': return 'Semester Genap';
            case '3': return 'Semester Pendek';
            default: return sem;
        }
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
                        {dataMode === 1 ? "Master Semester" : "Sampah Semester"}
                    </h1>
                    <p className="text-muted-foreground">
                        {dataMode === 1
                            ? "Kelola data semester akademik."
                            : "Kelola data semester yang sudah dihapus sementara."}
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
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

                    <button className="hidden sm:flex items-center gap-2 h-8 px-3 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-all text-xs font-medium border border-border">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>

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
                        <input
                            type="text"
                            placeholder="Cari semester..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full h-8 rounded-md border border-input bg-background !pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-8 px-3 bg-background border border-input rounded-md text-xs font-medium hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-8 px-3 bg-background border border-input rounded-md text-xs font-medium hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-3.5 h-3.5" />
                            View
                        </button>
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
                                        Semester
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                                <th className="shadcn-table-header">Tahun Ajaran</th>
                                <th className="shadcn-table-header">Periode</th>
                                <th className="shadcn-table-header">Status</th>
                                <th className="shadcn-table-header">Dibuat Oleh</th>
                                <th className="shadcn-table-header">Diupdate Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="h-24 text-center text-muted-foreground">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="h-24 text-center text-muted-foreground">
                                        Tidak ada data {dataMode === 2 ? 'terhapus' : ''} ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id_semester}
                                        className="border-b border-border transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted group"
                                    >
                                        <td className="shadcn-table-cell text-center font-mono text-xs text-muted-foreground">
                                            {dataMode === 1 ? (meta?.from ?? 1) + index : index + 1}
                                        </td>

                                        <td className="shadcn-table-cell text-center">
                                            <div className="flex justify-center gap-2">
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
                                                                    onClick={() => openConfirmDialog(item.id_semester, 'soft')}
                                                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => openConfirmDialog(item.id_semester, 'hard')}
                                                                    className="text-red-900 focus:text-red-900 cursor-pointer"
                                                                >
                                                                    <Trash className="mr-2 h-4 w-4" /> Hapus Permanen
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </>
                                                )}

                                                {dataMode === 2 && (
                                                    <>
                                                        <button
                                                            onClick={() => openConfirmDialog(item.id_semester, 'restore')}
                                                            className="p-1.5 hover:bg-primary/10 rounded-md text-primary hover:text-primary transition-colors"
                                                            title="Kembalikan Data"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openConfirmDialog(item.id_semester, 'hard')}
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
                                                {getSemesterLabel(item.semester)}
                                            </div>
                                        </td>

                                        <td className="shadcn-table-cell text-sm">
                                            {item.tahun_ajaran || "-"}
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

            <SemesterFormDialog
                open={isDialogOpen}
                onOpenChange={handleDialogChange}
                dataToEdit={selectedData}
            />

            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionType === 'restore' ? "Kembalikan Data?" : "Apakah Anda yakin?"}
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