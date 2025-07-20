import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h2>🤖 Hi, I am Judy – your Assistant</h2>

      {/* Chat Box */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          background: "#f9f9f9",
          marginBottom: "10px",
          textAlign: "left",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#888" }}>Start chatting with Judy...</p>
        )}

        {messages.map((m, i) => (
          <p key={i} style={{ margin: "5px 0" }}>
            <strong style={{ color: m.role === "user" ? "#007bff" : "#28a745" }}>
              {m.role === "user" ? "You" : "Judy"}:
            </strong>{" "}
            {m.content}
          </p>
        ))}
        {loading && <p style={{ color: "#999" }}>Judy is typing...</p>}
      </div>

      {/* Input + Button */}
      <div>
        <input
          style={{
            width: "75%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 12px",
            marginLeft: "5px",
            border: "none",
            borderRadius: "5px",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
