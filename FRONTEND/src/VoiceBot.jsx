// frontend/src/VoiceBot.js

import React, { useEffect, useState } from "react";

const VoiceBot = () => {
  const [socket, setSocket] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");

  // Set up the WebSocket connection to the FastAPI backend
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.onopen = () => {
      console.log("Connected to backend WebSocket");
    };
    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setBotResponse(event.data);
    };
    ws.onclose = () => {
      console.log("Disconnected from backend WebSocket");
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Set up continuous speech recognition using the Web Speech API.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome or Firefox.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        // Send the transcribed text to the backend if WebSocket is ready
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(finalTranscript);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [socket]);

  return (
    <div>
      <h2>Your Speech:</h2>
      <p style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{transcript}</p>
      <h2>Bot Response:</h2>
      <p style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{botResponse}</p>
    </div>
  );
};

export default VoiceBot;
