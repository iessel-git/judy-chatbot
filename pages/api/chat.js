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
  "what are your working hours": "We are open 24/7 for hotel guests, with restaurant service from 7 AM to 11 PM, and the night lounge opens from 6 PM to late.",
  "is there parking available": "Yes, we offer free and secure on-site parking for all guests.",
  "do you offer airport pickup": "Yes, we provide airport pickup and drop-off services upon request. Please contact us to arrange transportation.",
  "do you have free wifi": "Yes, complimentary high-speed WiFi is available throughout the hotel.",
  "are pets allowed": "Unfortunately, pets are not allowed at Rose Tavern, except for service animals.",
  "do you offer room service": "Yes, we provide 24-hour room service for all in-house guests.",
  "what amenities are included in the rooms": "Our rooms include air conditioning, smart TVs, mini bars, en-suite bathrooms, and luxury toiletries.",
  "do you have a swimming pool": "Yes, we have a clean, modern swimming pool available for guest use.",
  "is breakfast included in the room rate": "Yes, a complimentary breakfast is included with every room booking.",
  "do you have a spa or wellness center": "A full-service spa and wellness center is available for massages, facials, and relaxation.",
  "can i host a business meeting at rose tavern": "Absolutely, we have fully equipped meeting rooms and boardrooms for business functions.",
  "do you offer laundry services": "Yes, we offer same-day laundry and dry cleaning services for all guests.",
  "is the hotel family-friendly": "Yes, Rose Tavern is family-friendly and offers amenities for children and families.",
  "what safety measures do you have in place": "We have 24/7 security, CCTV monitoring, keycard access, and trained staff to ensure guest safety.",
  "do you accommodate special dietary needs": "Yes, our restaurant can accommodate vegetarian, vegan, gluten-free, and other dietary preferences with advance notice.",
  "can i check in early or check out late": "Early check-in and late check-out are available upon request and subject to availability.",
  "how far is rose tavern from the airport": "We are approximately 30 minutes from Kotoka International Airport, depending on traffic.",
  "is the hotel suitable for honeymoon stays": "Yes, we offer romantic honeymoon packages and private suite options for newlyweds.",
  "can i cancel or modify my reservation": "Yes, cancellations or modifications are allowed per our booking policy. Please check our website or contact the front desk for details.",
  "do you offer discounts for group bookings": "Yes, we provide discounts for group bookings, corporate stays, and long-term reservations. Contact us for a custom quote.",
  "how do i contact the front desk": "You can call us directly at the number listed on our Contact page or use the website's chat support."
}:

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
