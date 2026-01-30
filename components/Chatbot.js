import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [isTyping, setIsTyping] = useState(false);
  // 🎤 Voice Input (Speech → Text)
const startVoiceInput = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice input is not supported in this browser");
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.lang = language === "kn" ? "kn-IN" : "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const voiceText = event.results[0][0].transcript;
    setInput(voiceText);   // Put voice text into input box
  };

  recognition.onerror = (event) => {
    console.error("Voice recognition error:", event.error);
  };
};
// 🔊 Voice Output (Bot Speaks)
const speakText = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = language === "kn" ? "kn-IN" : "en-US";
  speech.pitch = 1;
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
};

  // Auto welcome greeting
  useEffect(() => {
    const welcome = language === "kn"
      ? "ನಮಸ್ಕಾರ! 😊 ನಾನು ನಿಮ್ಮ AFI ಹೆಲ್ತ್ ಅಸಿಸ್ಟೆಂಟ್. ನೀವು AFI, ಗರ್ಭಾವಸ್ಥೆ ಸಲಹೆಗಳು, ಮತ್ತು ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಕೇಳಬಹುದು."
      : "Hello! 😊 I am your AFI Health Assistant. You can ask about AFI, pregnancy tips, and health guidance.";

    setMessages([{ sender: "bot", text: welcome, time: new Date().toLocaleTimeString() }]);
  }, [language]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = {
    sender: "user",
    text: input,
    time: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setInput("");
  setIsTyping(true);

  try {
    const res = await axios.post(`${API_URL}/api/chat/`, {
      message: input,
      session_id: "patient123",
    });

    const botMsg = {
      sender: "bot",
      text: res.data.reply,
      time: new Date().toLocaleTimeString(),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      speakText(botMsg.text);
      setIsTyping(false);
    }, 800);

  } catch (err) {
    console.log("Chatbot Error:", err.response?.data || err.message);

    const botMsg = {
      sender: "bot",
      text: "Sorry, an error occurred.",
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  }
};

  return (
    <div style={{ padding: "10px" }}>
      {/* Language Dropdown */}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
        }}
      >
        <option value="en">English</option>
        <option value="kn">Kannada</option>
      </select>

      {/* Messages */}
      <div style={{ height: "330px", overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {msg.sender === "bot" && <span style={{ marginRight: "5px" }}>🤖</span>}
              <div
                style={{
                  background: msg.sender === "user" ? "#d5efff" : "#f0f0f0",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </div>
            </div>
            <div style={{ fontSize: "10px", color: "gray" }}>{msg.time}</div>
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div style={{ fontStyle: "italic", color: "gray" }}>AFI Assistant is typing...</div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px" }}>

  {/* 🎤 Voice Input Button */}
  <button
    onClick={startVoiceInput}
    style={{
      padding: "10px",
      background: "#ffcc00",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "18px"
    }}
  >
    🎤
  </button>

  {/* Text Input */}
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask something..."
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "1px solid #ccc",
    }}
  />

  {/* Send Button */}
  <button
    onClick={sendMessage}
    style={{
      padding: "10px 16px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
    }}
  >
    Send
  </button>
</div>
    </div>
  );
};

export default Chatbot;