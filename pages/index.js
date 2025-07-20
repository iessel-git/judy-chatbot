import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { role: "assistant", content: data.reply };
    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "50px auto",
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#fdfdfd",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#4b2e83",
          fontWeight: "600",
          marginBottom: "10px",
        }}
      >
        Hi, I’m Judy from Rose Tavern 💜
      </h2>
      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#555",
          marginBottom: "15px",
        }}
      >
        How can I help with your stay, reservation, or event?
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          backgroundColor: "#ffffff",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: "8px",
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "16px",
                backgroundColor:
                  m.role === "user" ? "#4b2e83" : "#f0f0f0",
                color: m.role === "user" ? "#fff" : "#333",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: "10px", display: "flex" }}>
        <input
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            outline: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          style={{
            marginLeft: "8px",
            backgroundColor: "#4b2e83",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </main>
  );
}
