import React, { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import axios from "axios";
import { createChatBotMessage } from "react-chatbot-kit";
import "./SpendWiseBot.css";

// --- Action Provider ---
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleUserMessage = async (message) => {
    try {
      const res = await axios.post("https://spenttracker-backend.onrender.com/api/v1/ask-ai", { prompt: message });
      const botMessage = createChatBotMessage(res.data.response);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      const errorMessage = createChatBotMessage("⚠️ Oops! I'm having trouble right now.");
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      actions: { handleUserMessage },
    })
  );
};

// --- Message Parser ---
const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    actions.handleUserMessage(message);
  };

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      parse,
      actions,
    })
  );
};

// --- Config ---
const config = {
  initialMessages: [
    createChatBotMessage("👋 Hi! I'm SpendWise Bot. Ask me anything about your finances!")
  ],
  botName: "SpendWise Bot",
};

const SpendWiseBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Floating Button */}
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)}>
        {open ? "✖" : "💬"}
      </button>

      {/* Chatbot Window */}
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>💰 SpendWise Bot</span>
            <button className="close-btn" onClick={() => setOpen(false)}>✖</button>
          </div>
          <div className="chatbot-body">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendWiseBot;
