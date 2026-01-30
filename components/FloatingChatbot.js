import React, { useState } from "react";
import Chatbot from "./Chatbot";

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            background: "#4CAF50",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 999,
            transition: "0.3s",
            animation: "pop 0.4s ease-out",
          }}
        >
          <span style={{ fontSize: "30px", color: "white" }}>💬</span>
        </div>
      )}

      {/* Chatbot Popup */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "330px",
            height: "480px",
            background: "#ffffff",
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            zIndex: 999,
            overflow: "hidden",
            animation: "slideUp 0.4s ease-out",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#4CAF50",
              padding: "15px",
              color: "white",
              fontWeight: "bold",
              fontSize: "17px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            AFI Health Assistant
            <span
              onClick={() => setOpen(false)}
              style={{
                cursor: "pointer",
                padding: "5px 10px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "10px",
              }}
            >
              ❌
            </span>
          </div>

          {/* Chatbot Body */}
          <Chatbot />
        </div>
      )}

      {/* CSS Animation */}
      <style>
        {`
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes pop {
          0% { transform: scale(0.3); }
          100% { transform: scale(1); }
        }
      `}
      </style>
    </>
  );
};

export default FloatingChatbot;