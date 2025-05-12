import express from "express";
import expressWs from "express-ws";

const { app } = expressWs(express());

// Add CORS middleware with WebSocket support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Upgrade, Connection"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Health check endpoint
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

// WebSocket endpoint
app.ws("/ws", (ws, _req) => {
  console.log("WebSocket connection established");

  // Send a ping message every 30 seconds to keep the connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "ping" }));
    }
  }, 30000);

  ws.on("message", (msg: any) => {
    console.log("message received from mobile magic", msg.toString());
    ws.send(msg);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clearInterval(pingInterval);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(pingInterval);
  });
});

// Get the port from environment variable or use 8000 as default
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
