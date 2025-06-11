export interface Soal {
    id: number
    pertayaan: string
    tipe: string
    pilihan: string[]
    jawaban: string
    id_level: number
    id_bahasa: number
    createdAt: string
}