import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple FAQ dictionary
const FAQ = {
  "what is your return policy": "You can return products within 30 days.",
  "do you offer discounts": "Yes, we provide seasonal discounts.",
  "how can i contact support": "Email us at support@company.com.",
};

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const normalizedMessage = normalize(message);

  // Check FAQ dictionary first
  if (FAQ[normalizedMessage]) {
    return res.json({ reply: FAQ[normalizedMessage] });
  }

  // If no FAQ match, fallback to OpenAI
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant answering questions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message || "OpenAI error" });
  }
}
