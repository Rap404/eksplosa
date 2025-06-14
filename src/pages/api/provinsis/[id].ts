import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Provinsi } from "@/types/provinsi";
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
            .from("provinsi")
            .select('*, provinsis_bahasas( bahasa (*) )')
            .eq('slug', id)
            .single();
        
        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data as Provinsi);
        }
    }

    if (req.method === "PUT") {
        const { nama, fakta_menarik } = req.body as Provinsi;

        const { data, error } = await supabase
            .from("provinsi")
            .update({ nama, fakta_menarik })
            .eq('slug', id)
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json(data as Provinsi);
        }
    }

    if (req.method === "DELETE") {
        const { error } = await supabase
            .from("provinsi")
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