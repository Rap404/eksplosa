import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Soal } from "@/types/soal";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const handled = runCors(req, res);
            if (handled) return;
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
    const { level, bahasa } = req.query;

    let query = supabase.from("soal").select("*, bahasa:id_bahasa(id, nama, slug)").order('id', { ascending: true });

    if (level) {
      query = query.eq('id_level', level);
    }

    if (bahasa) {
      query = query.eq('id_bahasa.slug', bahasa);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data as Soal[]);
  }

    if (req.method === "POST") {
        const { pertanyaan, pilihan, tipe, jawaban, id_level, id_bahasa } = req.body as Soal;

        try {
            const { data, error } = await supabase.from("soal")
                .insert({ pertanyaan, pilihan, tipe, jawaban, id_level, id_bahasa })
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return res.status(200).json(data as Soal);
        } catch (error) {
            return res.status(500).json({ error: `Error creating soal: ${(error as Error).message}` });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}