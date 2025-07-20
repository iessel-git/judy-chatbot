import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are Judy, a helpful assistant." }, { role: "user", content: message }]
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
