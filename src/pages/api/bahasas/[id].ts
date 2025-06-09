import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Bahasa } from "@/types/bahasa";
import { NextApiRequest, NextApiResponse } from "next";

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

        const { data, error } = await supabase
            .from("bahasa")
            .update({ nama })
            .eq('slug', id)
            .select()
            .single();

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