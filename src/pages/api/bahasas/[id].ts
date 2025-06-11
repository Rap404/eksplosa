import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Bahasa } from "@/types/bahasa";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const handled = runCors(req, res);
    if (handled) return;
    
    const { id } = req.query;
    
        if (req.method === "OPTIONS") {
        return res.status(200).end();
      }


    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("bahasa")
            .select('*, provinsis_bahasas( provinsi (*) ), soal(*)')
            .eq('slug', id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data as Bahasa);
        }
    }

    if (req.method === "PUT") {
        const { nama } = req.body as Bahasa;
        const provinsis_bahasas = req.body.provinsis_bahasas as number[] | undefined;

        const slug = slugify(nama, {
            lower: true
        })

        const { data, error } = await supabase
            .from("bahasa")
            .update({ nama, slug })
            .eq('id', id)
            .select()
            .single();

        if (provinsis_bahasas && provinsis_bahasas.length > 0) {
            const provinsiInsert = provinsis_bahasas.map((provinsiId: number) => ({
                id_bahasa: data.id,
                id_provinsi: provinsiId
            }));

            const { error: provinsiError } = await supabase.from("provinsis_bahasas")
                .upsert(provinsiInsert);

            if (provinsiError) {
                return res.status(500).json({ error: provinsiError.message });
            }
        }

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data as Bahasa);
        }
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("bahasa")
            .delete()
            .eq('slug', id);

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(204).end();
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}