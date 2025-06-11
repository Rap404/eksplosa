export interface Soal {
    id: number
    pertanyaan: string
    tipe: string
    pilihan: string[]
    jawaban: string
    id_level: number
    id_bahasa: number
    createdAt: string
}