"use client";

import React, { useEffect, useState } from "react";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const HomePage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Get WebSocket URL from environment variable

    if (!wsUrl) {
      console.error("WebSocket URL not found in environment variables");
      return;
    }

    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send("Hello Server!");
      setIsConnected(true);
    };

    newSocket.onmessage = (message) => {
      console.log("Message received:", message.data);
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    newSocket.onclose = () => {
      console.log("Connection closed");
      setIsConnected(false);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div>
      {socket && isConnected ? (
        <>
          <h1>hi there</h1>
          <h2>Connection Established</h2>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={() => socket?.send(message)}>Send Message</button>
          <button
            onClick={() => {
              socket?.close();
              setIsConnected(false);
            }}
          >
            Close Connection
          </button>
        </>
      ) : (
        <h2>Connection Not Established</h2>
      )}

      <div>
        <p>WebSocket URL:</p>
        <p>{wsUrl}</p>
      </div>
    </div>
  );
};

export default HomePage;
