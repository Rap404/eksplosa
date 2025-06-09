export interface Provinsi {
    id: number
    nama: string
    slug: string
    fakta_menarik: object
    created_at: string
    bahasa: {
        id: number
        nama: string
        created_at: string
    }
}