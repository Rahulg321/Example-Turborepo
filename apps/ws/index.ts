import express from "express";
import { WebSocketServer, WebSocket as WS } from "ws";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", function connection(ws: WS) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    console.log("message received from mobile magic", data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  console.log("connection established from mobile magic");
  ws.send("Hello! Message From Mobile Magic!!");
});
