import { runCors } from "@/lib/cors";
import { supabase } from "@/lib/supabase";
import { Level } from "@/types/level";
import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const handled = runCors(req, res);
            if (handled) return;
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method === "GET") {
        const { data, error } = await supabase.from("levels")
            .select('*, soal(*)')
            .order('id', { ascending: true });
        
        if (error) {
            return res.status(500).json({ error: `${error.message}` });
        } else {
            return res.status(200).json(data as Level[]);
        }
    }
    
    if (req.method === "POST") {
        const { level, topik } = req.body as Level;
        const slug = slugify(level, {
            lower: true})

        const { data, error } = await supabase.from("levels")
            .insert({ level, slug, topik })
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: `${error.message}` });
        } else {
            return res.status(200).json(data as Level);
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}