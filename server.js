const { ExpressPeerServer } = require("peer");
const express = require("express");

const app = express();

// Health-check endpoint (для keep-alive пингов от клиентов)
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

const httpServer = app.listen(process.env.PORT || 9000);

const peerServer = ExpressPeerServer(httpServer, {
  path: "/",
  allow_discovery: false
});

app.use("/peerjs", peerServer);

peerServer.on("connection", (client) => {
  console.log("connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
  console.log("disconnected:", client.getId());
});

console.log("PeerJS signaling server running on port " + (process.env.PORT || 9000));
