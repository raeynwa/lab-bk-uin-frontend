'use client'

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, XCircle, AlertTriangle, Filter } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { checkExistingNims, importMahasiswaBatch } from "@/app/actions/mahasiswa"

interface ImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

type ImportRow = {
    nim: string
    nama_mahasiswa: string
    jenis_kelamin: string
    email: string
    phone_number: string
    status: 'valid' | 'duplicate' | 'error'
    message?: string
}

export function MahasiswaImportDialog({ open, onOpenChange, onSuccess }: ImportDialogProps) {
    const [step, setStep] = useState<'upload' | 'review' | 'processing' | 'result'>('upload')
    const [data, setData] = useState<ImportRow[]>([])
    const [summary, setSummary] = useState({ valid: 0, duplicate: 0, error: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State baru untuk filter tampilan berdasarkan klik kartu
    const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'duplicate' | 'error'>('all')

    // Reset state saat modal ditutup/dibuka
    const handleOpenChange = (val: boolean) => {
        if (!val) {
            setTimeout(() => {
                setStep('upload')
                setData([])
                setFilterStatus('all') // Reset filter
                setIsDragging(false)
            }, 300)
        }
        onOpenChange(val)
    }

    const processFile = (file: File) => {
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result
                const wb = XLSX.read(bstr, { type: 'binary' })
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const jsonData = XLSX.utils.sheet_to_json(ws) as any[]

                const processedData: ImportRow[] = jsonData.map((row) => {
                    const nim = String(row['NIM'] || '').trim()
                    const nama = row['Nama Mahasiswa'] || ''
                    const jk = (row['Jenis Kelamin (L/P)'] || '').toUpperCase()
                    const email = row['email'] || ''
                    const hp = row['Nomor Telepon'] || ''

                    let status: 'valid' | 'error' = 'valid'
                    let message = ''

                    if (!nim) { status = 'error'; message = 'NIM kosong' }
                    else if (!nama) { status = 'error'; message = 'Nama kosong' }
                    else if (jk !== 'L' && jk !== 'P') { status = 'error'; message = 'Format JK salah (L/P)' }

                    return {
                        nim,
                        nama_mahasiswa: nama,
                        jenis_kelamin: jk,
                        email,
                        phone_number: hp,
                        status,
                        message
                    }
                })

                const nimsToCheck = processedData.filter(d => d.status === 'valid').map(d => d.nim)

                if (nimsToCheck.length > 0) {
                    const res = await checkExistingNims(nimsToCheck)
                    const existingNims = res?.existing_nims || []

                    processedData.forEach(row => {
                        if (row.status === 'valid' && existingNims.includes(row.nim)) {
                            row.status = 'duplicate'
                            row.message = 'NIM sudah terdaftar'
                        }
                    })
                }

                const valid = processedData.filter(d => d.status === 'valid').length
                const duplicate = processedData.filter(d => d.status === 'duplicate').length
                const error = processedData.filter(d => d.status === 'error').length

                setData(processedData)
                setSummary({ valid, duplicate, error })
                setFilterStatus('all') // Reset filter saat file baru diupload
                setStep('review')

            } catch (err) {
                console.error(err)
                toast.error("Gagal membaca file excel. Pastikan format benar.")
            }
        }
        reader.readAsBinaryString(file)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) processFile(file)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const file = e.dataTransfer.files?.[0]
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
            processFile(file)
        } else {
            toast.error("Format file tidak didukung. Harap upload Excel (.xlsx/.xls) atau CSV.")
        }
    }

    const handleProcessImport = async () => {
        setStep('processing')
        const validData = data.filter(d => d.status === 'valid')

        if (validData.length === 0) {
            toast.error("Tidak ada data valid untuk diimport")
            setStep('review')
            return
        }

        const res = await importMahasiswaBatch(validData)

        if (res.error) {
            toast.error(res.error)
            setStep('review')
        } else {
            toast.success(res.message)
            setStep('result')
            onSuccess()
        }
    }

    const handleDownloadTemplate = (e: React.MouseEvent) => {
        e.stopPropagation()

        const headers = [
            "Nama Mahasiswa",
            "NIM",
            "Jenis Kelamin (L/P)",
            "email",
            "Nomor Telepon"
        ]

        const sampleData = [
            {
                "Nama Mahasiswa": "Contoh Mahasiswa 1",
                "NIM": "20230001",
                "Jenis Kelamin (L/P)": "L",
                "email": "contoh1@email.com",
                "Nomor Telepon": "081234567890"
            },
            {
                "Nama Mahasiswa": "Contoh Mahasiswa 2",
                "NIM": "20230002",
                "Jenis Kelamin (L/P)": "P",
                "email": "contoh2@email.com",
                "Nomor Telepon": "081987654321"
            }
        ]

        const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers })

        const wscols = [
            { wch: 25 },
            { wch: 15 },
            { wch: 15 },
            { wch: 25 },
            { wch: 15 }
        ]
        ws['!cols'] = wscols

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Template")
        XLSX.writeFile(wb, "Template_Import_Mahasiswa.xlsx")
    }

    const downloadFailedData = () => {
        const failedData = data.filter(d => d.status !== 'valid').map(d => ({
            'Nama Mahasiswa': d.nama_mahasiswa,
            'NIM': d.nim,
            'Jenis Kelamin (L/P)': d.jenis_kelamin,
            'email': d.email,
            'Nomor Telepon': d.phone_number,
            'Error': d.message
        }))

        const ws = XLSX.utils.json_to_sheet(failedData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Data Gagal")
        XLSX.writeFile(wb, "Data_Import_Gagal.xlsx")
    }

    // Helper untuk filter data tampilan tabel
    const displayedData = filterStatus === 'all'
        ? data
        : data.filter(d => d.status === filterStatus)

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-card text-card-foreground">

                <div className="p-6 border-b border-border bg-muted/10">
                    <DialogTitle>Import Data Mahasiswa</DialogTitle>
                    <DialogDescription>
                        Import data massal menggunakan file Excel (.xlsx / .csv)
                    </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-6">

                    {step === 'upload' && (
                        <div
                            className={`flex flex-col items-center justify-center h-72 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${isDragging
                                    ? "border-primary bg-primary/10"
                                    : "border-muted-foreground/25 bg-muted/5 hover:bg-muted/10"
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FileSpreadsheet className={`w-12 h-12 mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm text-muted-foreground mb-1 font-medium">
                                {isDragging ? "Lepaskan file di sini" : "Drag & drop file Excel di sini"}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mb-6">Atau klik untuk memilih file dari komputer</p>

                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />

                            <div className="flex flex-col gap-3 items-center w-full max-w-xs">
                                <Button variant={isDragging ? "default" : "default"} className="pointer-events-none w-full shadow-md">
                                    <Upload className="w-4 h-4 mr-2" /> Pilih File Excel
                                </Button>

                                <div className="flex items-center gap-2 w-full">
                                    <div className="h-[1px] bg-border flex-1"></div>
                                    <span className="text-[10px] text-muted-foreground uppercase">Atau</span>
                                    <div className="h-[1px] bg-border flex-1"></div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadTemplate}
                                    className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-600 z-10 bg-background/50"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Template Excel
                                </Button>
                            </div>

                        </div>
                    )}

                    {(step === 'review' || step === 'processing') && (
                        <div className="space-y-4">
                            {/* Filter Cards - Sekarang bisa diklik */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Kartu Valid */}
                                <div
                                    onClick={() => setFilterStatus(filterStatus === 'valid' ? 'all' : 'valid')}
                                    className={`p-4 rounded-lg border text-center cursor-pointer transition-all ${filterStatus === 'valid'
                                            ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500 ring-offset-1 dark:ring-offset-slate-900'
                                            : 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                                        }`}
                                >
                                    <span className="block text-2xl font-bold text-green-600">{summary.valid}</span>
                                    <span className="text-xs text-muted-foreground">Siap Diproses</span>
                                </div>

                                {/* Kartu Duplikat */}
                                <div
                                    onClick={() => setFilterStatus(filterStatus === 'duplicate' ? 'all' : 'duplicate')}
                                    className={`p-4 rounded-lg border text-center cursor-pointer transition-all ${filterStatus === 'duplicate'
                                            ? 'bg-yellow-500/20 border-yellow-500 ring-2 ring-yellow-500 ring-offset-1 dark:ring-offset-slate-900'
                                            : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'
                                        }`}
                                >
                                    <span className="block text-2xl font-bold text-yellow-600">{summary.duplicate}</span>
                                    <span className="text-xs text-muted-foreground">Duplikat (Skip)</span>
                                </div>

                                {/* Kartu Error */}
                                <div
                                    onClick={() => setFilterStatus(filterStatus === 'error' ? 'all' : 'error')}
                                    className={`p-4 rounded-lg border text-center cursor-pointer transition-all ${filterStatus === 'error'
                                            ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500 ring-offset-1 dark:ring-offset-slate-900'
                                            : 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                                        }`}
                                >
                                    <span className="block text-2xl font-bold text-red-600">{summary.error}</span>
                                    <span className="text-xs text-muted-foreground">Error (Format)</span>
                                </div>
                            </div>

                            {/* Info Filter Aktif */}
                            {filterStatus !== 'all' && (
                                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                                    <span>Menampilkan data: <strong>{filterStatus.toUpperCase()}</strong></span>
                                    <button onClick={() => setFilterStatus('all')} className="text-primary hover:underline">
                                        Tampilkan Semua ({data.length})
                                    </button>
                                </div>
                            )}

                            {/* Preview Table - Sekarang menampilkan displayedData */}
                            <div className="border border-border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-muted text-muted-foreground sticky top-0">
                                        <tr>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">NIM</th>
                                            <th className="p-2">Nama</th>
                                            <th className="p-2">Pesan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedData.length > 0 ? (
                                            displayedData.map((row, i) => (
                                                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                                                    <td className="p-2">
                                                        {row.status === 'valid' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                        {row.status === 'duplicate' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                                        {row.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                                                    </td>
                                                    <td className="p-2 font-mono">{row.nim}</td>
                                                    <td className="p-2">{row.nama_mahasiswa}</td>
                                                    <td className="p-2 text-muted-foreground">{row.message || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                    Tidak ada data dengan status ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Import Berhasil!</h3>
                            <p className="text-muted-foreground mb-6">
                                {summary.valid} data berhasil disimpan ke database. <br />
                                {(summary.duplicate + summary.error) > 0 && "Beberapa data dilewati karena duplikat atau error."}
                            </p>

                            {(summary.duplicate + summary.error) > 0 && (
                                <Button variant="outline" onClick={downloadFailedData} className="gap-2">
                                    <Download className="w-4 h-4" /> Download Data Gagal
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-2">
                    {step === 'review' && (
                        <>
                            <Button variant="outline" onClick={() => setStep('upload')}>Upload Ulang</Button>
                            <Button onClick={handleProcessImport} disabled={summary.valid === 0}>
                                Proses {summary.valid} Data
                            </Button>
                        </>
                    )}
                    {step === 'processing' && (
                        <Button disabled>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
                        </Button>
                    )}
                    {step === 'result' && (
                        <Button onClick={() => handleOpenChange(false)}>Tutup</Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    )
}