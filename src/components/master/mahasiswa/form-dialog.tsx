'use client'

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2, User, Phone, Mail, Hash } from "lucide-react"
import { createMahasiswa, updateMahasiswa } from "@/app/actions/mahasiswa"
import { toast } from "sonner"
import { Mahasiswa } from "@/types/master"

interface FormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    dataToEdit?: Mahasiswa | null
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

export function MahasiswaFormDialog({ open, onOpenChange, dataToEdit }: FormDialogProps) {
    const isEdit = !!dataToEdit
    const action = isEdit ? updateMahasiswa.bind(null, dataToEdit.id_mahasiswa) : createMahasiswa

    const [status, setStatus] = useState("1")
    const [jk, setJk] = useState("L")

    useEffect(() => {
        if (open) {
            setStatus(dataToEdit ? String(dataToEdit.sts_aktif) : "1")
            // UPDATE: Ambil dari field jenis_kelamin
            setJk(dataToEdit?.jenis_kelamin || "L")
        }
    }, [open, dataToEdit])

    async function handleSubmit(formData: FormData) {
        if (status === "1") {
            formData.set('sts_aktif', 'on');
        } else {
            formData.delete('sts_aktif');
        }
        // UPDATE: Set field 'jenis_kelamin'
        formData.set('jenis_kelamin', jk);

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
                            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isEdit ? "Perbarui data mahasiswa." : "Input data mahasiswa baru."}
                        </p>
                    </div>
                </div>

                <form action={handleSubmit}>
                    <div className="p-6 space-y-4">

                        {/* NIM */}
                        <div className="space-y-2">
                            <label htmlFor="nim" className="text-sm font-medium leading-none">
                                NIM <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="nim"
                                    name="nim"
                                    type="text"
                                    placeholder="Contoh: 2023001"
                                    defaultValue={dataToEdit?.nim}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>

                        {/* Nama Lengkap -> nama_mahasiswa */}
                        <div className="space-y-2">
                            <label htmlFor="nama_mahasiswa" className="text-sm font-medium leading-none">
                                Nama Lengkap <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="nama_mahasiswa"
                                    name="nama_mahasiswa" // UPDATE: name disesuaikan dengan backend
                                    type="text"
                                    placeholder="Nama Lengkap Mahasiswa"
                                    defaultValue={dataToEdit?.nama_mahasiswa} // UPDATE: defaultValue disesuaikan
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>

                        {/* Email & No HP -> phone_number */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        defaultValue={dataToEdit?.email}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone_number" className="text-sm font-medium leading-none">No. HP</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="phone_number"
                                        name="phone_number" // UPDATE: name disesuaikan dengan backend
                                        type="text"
                                        placeholder="0812..."
                                        defaultValue={dataToEdit?.phone_number} // UPDATE: defaultValue disesuaikan
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Jenis Kelamin</label>
                            <div className="flex gap-4 pt-1">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jk_radio"
                                        value="L"
                                        checked={jk === "L"}
                                        onChange={() => setJk("L")}
                                        className="accent-primary h-4 w-4"
                                    />
                                    <span className="text-sm">Laki-laki</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="jk_radio"
                                        value="P"
                                        checked={jk === "P"}
                                        onChange={() => setJk("P")}
                                        className="accent-primary h-4 w-4"
                                    />
                                    <span className="text-sm">Perempuan</span>
                                </label>
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