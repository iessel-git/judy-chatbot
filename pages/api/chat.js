export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;

  // ✅ FAQ Dictionary (Rose Tavern Specific)
  const FAQ = {
    "what is rose tavern": "Rose Tavern is a modern upscale hotel in Tema, Ghana, offering luxury rooms, fine dining, an upscale night lounge, and event hosting.",
    "where are you located": "We are located in Tema, Ghana. Visit our Contact page for a map and directions.",
    "what rooms do you have": "We offer executive suites, deluxe rooms, and standard rooms — all with modern amenities.",
    "do you have a restaurant": "Yes, Rose Tavern has a fine-dining restaurant with a variety of international and local dishes.",
    "do you host events": "Yes, we host corporate events, weddings, and private parties in our stylish event spaces.",
    "do you have wedding or conference space": "Yes, we have a beautiful wedding and conference space equipped with modern facilities, perfect for events of all sizes.",
    "do you have an upscale night lounge": "Yes, Rose Tavern features an upscale night lounge with premium drinks, music, and a relaxed, classy vibe.",
    "how can i make a reservation": "You can book a room, event, or table through our website's booking page or by calling our front desk directly.",
    "what are your working hours": "We are open 24/7 for hotel guests, with restaurant service from 7 AM to 11 PM, and the night lounge opens from 6 PM to late."
  };

  // ✅ Normalize the user's message for better matching
  const normalize = (text) =>
    text.toLowerCase().replace(/[^\w\s]/gi, "").trim();

  const userQuestion = normalize(message);

  if (FAQ[userQuestion]) {
    return res.status(200).json({ reply: FAQ[userQuestion] });
  }

  // ✅ Fallback to OpenAI if no FAQ match
  try {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Judy, the friendly Rose Tavern assistant. If the question is about Rose Tavern, answer based on what you know about the hotel. If unsure, politely say you are not certain but can assist with general inquiries.",
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res
      .status(500)
      .json({ reply: "Sorry, I’m having trouble answering right now." });
  }
}
