import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Provinsi } from "@/types/provinsi";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

    const handled = runCors(req, res);
            if (handled) return;
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        const { data, error } = await supabase.from("provinsi")
            .select('*, provinsis_bahasas( bahasa (*) )')
            .order('id', { ascending: true });

        if (error) {
                return res.status(500).json({ error: `${error.message}` });
            } else {
                return res.status(200).json(data as Provinsi[]);
            }
    }

    if (req.method === "POST") {
        const {nama, fakta_menarik } = req.body as Provinsi;
        const slug = slugify(nama, {
            lower: true})
        
        const { data, error } = await supabase.from("provinsi")
            .insert({ nama, slug, fakta_menarik })
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: `${error.message}` });
        } else {
            return res.status(200).json(data as Provinsi);
        }
    }
    

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}