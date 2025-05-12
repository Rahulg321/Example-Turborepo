"use client";

import React, { useEffect, useState, useCallback } from "react";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const HomePage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 5;

  const connectWebSocket = useCallback(() => {
    if (!wsUrl) {
      console.error("WebSocket URL not found in environment variables");
      return;
    }

    try {
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("Connection established");
        setIsConnected(true);
        setRetryCount(0); // Reset retry count on successful connection
      };

      newSocket.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          if (data.type === "ping") {
            newSocket.send(JSON.stringify({ type: "pong" }));
          } else {
            console.log("Message received:", message.data);
          }
        } catch (e) {
          console.log("Message received:", message.data);
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      newSocket.onclose = (event) => {
        console.log("Connection closed", event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect if not closed cleanly
        if (event.code !== 1000 && retryCount < maxRetries) {
          console.log(
            `Attempting to reconnect (${retryCount + 1}/${maxRetries})...`
          );
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            connectWebSocket();
          }, 3000); // Wait 3 seconds before retrying
        }
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setIsConnected(false);
    }
  }, [retryCount]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close(1000, "Component unmounting");
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      setMessage("");
    } else {
      console.error("Cannot send message - WebSocket is not connected");
    }
  }, [socket, message]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">WebSocket Connection Status</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
          />
          <h2 className="text-lg">
            {isConnected ? "Connected" : "Disconnected"}
          </h2>
        </div>
      </div>

      {isConnected && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>WebSocket URL:</p>
        <p className="font-mono">{wsUrl}</p>
      </div>
    </div>
  );
};

export default HomePage;
