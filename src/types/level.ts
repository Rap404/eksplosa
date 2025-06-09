import { Soal } from "./soal"

export interface Level {
    id: number
    level: string
    topik: string
    soal: Soal[]
    createdAt: string
}