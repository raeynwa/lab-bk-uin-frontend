'use client'

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { createTahunAjaran, updateTahunAjaran } from "@/app/actions/tahun-ajaran"
import { toast } from "sonner"
import { TahunAjaran } from "@/types/master"

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dataToEdit?: TahunAjaran | null
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:brightness-110 shadow-md shadow-primary/10 transition-all text-sm font-medium"
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                </>
            ) : (
                "Simpan Data"
            )}
        </Button>
    )
}

export function TahunAjaranFormDialog({ open, onOpenChange, dataToEdit }: FormDialogProps) {
    const isEdit = !!dataToEdit
    const action = isEdit ? updateTahunAjaran.bind(null, dataToEdit.id_tahun_ajaran) : createTahunAjaran

    // State lokal untuk handling UI interaktif (seperti Status Segmented Control)
    // PERBAIKAN: Menggunakan "2" sebagai nilai default untuk Tidak Aktif sesuai request
    const [status, setStatus] = useState("1") // "1" = Aktif, "2" = Tidak Aktif

    // Sinkronisasi state saat modal dibuka/data berubah
    useEffect(() => {
        if (open) {
            // PERBAIKAN: Gunakan String() untuk memaksa konversi tipe data
            setStatus(dataToEdit ? String(dataToEdit.sts_aktif) : "1")
        }
    }, [open, dataToEdit])

    async function handleSubmit(formData: FormData) {
        // Pastikan status yang dipilih masuk ke FormData
        if (status === "1") {
            formData.set('sts_aktif', 'on');
        } else {
            // Untuk status "2" (Tidak Aktif), kita hapus key ini agar backend menerimanya sebagai non-aktif
            // (Asumsi backend menangani null/missing value sebagai tidak aktif/2)
            formData.delete('sts_aktif');
        }

        const res = await action(null, formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(isEdit ? "Data berhasil diperbarui" : "Data berhasil ditambahkan")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-card text-card-foreground rounded-xl shadow-xl border border-border">

                {/* Header Modal Custom */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                    <div>
                        <DialogTitle className="text-xl font-semibold tracking-tight">
                            {isEdit ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEdit ? "Perbarui informasi periode akademik." : "Buat periode akademik baru."}
                        </p>
                    </div>
                </div>

                <form action={handleSubmit}>
                    <div className="p-6 space-y-6">

                        {/* Input Tahun Ajaran */}
                        <div className="space-y-2">
                            <label htmlFor="tahun_ajaran" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Tahun Ajaran <span className="text-destructive">*</span>
                            </label>
                            <input
                                id="tahun_ajaran"
                                name="tahun_ajaran"
                                type="text"
                                placeholder="Contoh: 2025-2026"
                                defaultValue={dataToEdit?.tahun_ajaran}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                            />
                        </div>

                        {/* Input Tanggal (Grid 2 Kolom) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="periode_awal" className="text-sm font-medium leading-none">Tanggal Mulai</label>
                                <div className="relative">
                                    <input
                                        id="periode_awal"
                                        name="periode_awal"
                                        type="date"
                                        defaultValue={dataToEdit?.periode_awal ? new Date(dataToEdit.periode_awal).toISOString().split('T')[0] : ''}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm text-muted-foreground focus:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 z-10 relative bg-transparent"
                                    />
                                    <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-0 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="periode_akhir" className="text-sm font-medium leading-none">Tanggal Berakhir</label>
                                <div className="relative">
                                    <input
                                        id="periode_akhir"
                                        name="periode_akhir"
                                        type="date"
                                        defaultValue={dataToEdit?.periode_akhir ? new Date(dataToEdit.periode_akhir).toISOString().split('T')[0] : ''}
                                        required
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm text-muted-foreground focus:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 z-10 relative bg-transparent"
                                    />
                                    <CalendarDays className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-0 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Status Selection (Segmented Control Style) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Status</label>
                            {/* Hidden input untuk menyimpan value agar bisa dibaca formData */}
                            <input type="hidden" name="sts_aktif" value={status === "1" ? "on" : ""} />

                            <div className="flex p-1 bg-muted/50 rounded-lg border border-border/50">
                                <button
                                    type="button"
                                    onClick={() => setStatus("1")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${status === "1"
                                            ? 'bg-background text-primary shadow-sm border border-border/50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Aktif
                                </button>
                                <button
                                    type="button"
                                    // PERBAIKAN: Ubah nilai setStatus menjadi "2"
                                    onClick={() => setStatus("2")}
                                    // PERBAIKAN: Ubah pengecekan kondisi menjadi status === "2"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${status === "2"
                                            ? 'bg-background text-destructive shadow-sm border border-border/50'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                        }`}
                                >
                                    <XCircle className="w-4 h-4" />
                                    Tidak Aktif
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-secondary text-foreground transition-colors"
                        >
                            Batal
                        </Button>
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}