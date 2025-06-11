import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Bahasa } from "@/types/bahasa";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const handled = runCors(req, res);
            if (handled) return;
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        const { data, error } = await supabase.from("bahasa")
            .select('*, provinsis_bahasas( provinsi (*) ), soal(*)')
            .order('id', { ascending: true });

        if (error) {
            return res.status(500).json({ error: `${error.message}` });
        } else {
            return res.status(200).json(data as Bahasa[]);
        }
    }

    if (req.method === "POST") {
        const { nama } = req.body as Bahasa;
        const provinsis_bahasas = req.body.provinsis_bahasas as number[] | undefined;
        const slug = slugify(nama, {
            lower: true})

        try {  
        const { data, error } = await supabase.from("bahasa")
            .insert({ nama, slug })
            .select()
            .single();
        
        if (error) {
            throw new Error(error.message);
        }

        if (provinsis_bahasas && provinsis_bahasas.length > 0) {
            const provinsiInsert = provinsis_bahasas.map((provinsiId: number) => ({
                id_bahasa: data.id,
                id_provinsi: provinsiId
            }));

            const { error: provinsiError } = await supabase.from("provinsis_bahasas")
                .insert(provinsiInsert);

            if (provinsiError) {
                throw new Error(provinsiError.message);
            }
        }
        return res.status(200).json(data as Bahasa);
        } catch (error) {
            return res.status(500).json({ error: `Error creating bahasa: ${(error as Error).message}` });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}