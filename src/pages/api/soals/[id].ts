import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const handled = runCors(req, res);
    if (handled) return;
    
    const { id } = req.query;
    
        if (req.method === "OPTIONS") {
        return res.status(200).end();
      }

    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("soals")
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data);
        }
    }

    if (req.method === "PUT") {
        const { pertayaan, pilihan, tipe, jawaban, id_level, id_bahasa } = req.body;

        const { data, error } = await supabase
            .from("soals")
            .update({ pertayaan, pilihan, tipe, jawaban, id_level, id_bahasa })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data);
        }
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("soals")
            .delete()
            .eq('id', id);

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(204).end();
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}