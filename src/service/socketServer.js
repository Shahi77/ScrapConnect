const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map(); // { socketId: { userId, userType, lat, lng } }

io.on("connection", async (socket) => {
  console.log(socket);
  try {
    // Read token from cookies
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    let token = cookies.token;

    // If token is not found in cookies, try reading from headers
    if (!token && socket.handshake.headers.authorization) {
      token = socket.handshake.headers.authorization.split(" ")[1]; // Bearer <TOKEN>
    }

    if (!token) {
      console.log("No token provided. Disconnecting!");
      socket.disconnect(true);
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.log("User not found. Disconnecting!");
      socket.disconnect(true);
      return;
    }
    // Store user data associated with socket.id
    connectedUsers.set(socket.id, {
      userId: user.id,
      userType: user.userType,
      lat: user.lat || 0,
      lng: user.lng || 0,
    });

    console.log(`User ${user.id} authenticated with socket: ${socket.id}`);

    // Handle incoming messages
    socket.on("message", (data) => {
      console.log(`Message from ${user.id}: ${data}`);
      socket.send(`Echo: ${data}`);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`User ${user.id} disconnected`);
      connectedUsers.delete(socket.id);
    });
  } catch (error) {
    console.log("WebSocket Authentication Failed:", error.message);
    socket.disconnect(true);
  }
});

module.exports = { server, app, io };
