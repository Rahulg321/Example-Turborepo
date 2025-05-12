import express from "express";
import expressWs from "express-ws";

const { app } = expressWs(express());

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Health check endpoint
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

// WebSocket endpoint
app.ws("/ws", (ws, _req) => {
  console.log("WebSocket connection established");

  ws.on("message", (msg: any) => {
    console.log("message received from mobile magic", msg.toString());
    ws.send(msg);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

// Get the port from environment variable or use 8000 as default
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
