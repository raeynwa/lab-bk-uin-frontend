'use client'

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarDays, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { createSemester, updateSemester } from "@/app/actions/semester"
import { getAllTahunAjaran } from "@/app/actions/tahun-ajaran"
import { toast } from "sonner"
import { Semester, TahunAjaran } from "@/types/master"

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dataToEdit?: Semester | null
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

export function SemesterFormDialog({ open, onOpenChange, dataToEdit }: FormDialogProps) {
    const isEdit = !!dataToEdit
    const action = isEdit ? updateSemester.bind(null, dataToEdit.id_semester) : createSemester

    const [status, setStatus] = useState("1")
    const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>([])

    // Fetch list tahun ajaran saat modal dibuka
    useEffect(() => {
        if (open) {
            setStatus(dataToEdit ? String(dataToEdit.sts_aktif) : "1")

            // Ambil data tahun ajaran untuk dropdown
            const fetchTA = async () => {
                const data = await getAllTahunAjaran()
                setTahunAjaranList(data)
            }
            fetchTA()
        }
    }, [open, dataToEdit])

    async function handleSubmit(formData: FormData) {
        if (status === "1") {
            formData.set('sts_aktif', 'on');
        } else {
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

                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                    <div>
                        <DialogTitle className="text-xl font-semibold tracking-tight">
                            {isEdit ? "Edit Semester" : "Tambah Semester"}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEdit ? "Perbarui informasi semester." : "Buat periode semester baru."}
                        </p>
                    </div>
                </div>

                <form action={handleSubmit}>
                    <div className="p-6 space-y-6">

                        {/* Input Tahun Ajaran (Dropdown) */}
                        <div className="space-y-2">
                            <label htmlFor="id_tahun_ajaran_fr" className="text-sm font-medium leading-none">
                                Tahun Ajaran <span className="text-destructive">*</span>
                            </label>
                            <select
                                id="id_tahun_ajaran_fr"
                                name="id_tahun_ajaran_fr"
                                required
                                defaultValue={dataToEdit?.id_tahun_ajaran_fr || ""}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="" disabled>Pilih Tahun Ajaran</option>
                                {tahunAjaranList.map((ta) => (
                                    <option key={ta.id_tahun_ajaran} value={ta.id_tahun_ajaran}>
                                        {ta.tahun_ajaran}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Input Semester (Dropdown Select) - UPDATE DISINI */}
                        <div className="space-y-2">
                            <label htmlFor="semester" className="text-sm font-medium leading-none">
                                Nama Semester <span className="text-destructive">*</span>
                            </label>
                            <select
                                id="semester"
                                name="semester"
                                required
                                defaultValue={dataToEdit?.semester || ""}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="" disabled>Pilih Semester</option>
                                <option value="1">Semester Ganjil</option>
                                <option value="2">Semester Genap</option>
                                <option value="3">Semester Pendek</option>
                            </select>
                        </div>

                        {/* Input Tanggal */}
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

                        {/* Status Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Status</label>
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
                                    onClick={() => setStatus("2")}
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