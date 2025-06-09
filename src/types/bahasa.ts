export interface Bahasa {
    id: number
    nama: string
    slug: string
    createdAt: string
    provinsis_bahasas: string[]
    soal: {
        id: number
        pertanyaan: string
        pilihan: string[]
        jawaban: string
        createdAt: string
    }
}